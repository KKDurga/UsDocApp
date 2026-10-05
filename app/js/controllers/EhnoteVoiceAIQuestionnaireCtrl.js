"use strict";
/*  Settings > Visit Reason > AI Call Questionnaires
 *
 *  Questions the AI assistant asks patients on post-surgery follow-up calls. The
 *  clinic calls the patient a set number of days after surgery; which questions get
 *  asked depends on the surgery category and the branch.
 *
 *  Two views in one controller, switched by vaqView: the list, and the add/edit form.
 *  They share the branch and category dropdowns, which is why they are not split.
 *
 *  SCOPING - the part that is easy to get wrong:
 *    OrganizationId    null = All Branches   (NOT 0 - 0 would be a real branch id)
 *    SurgeryCategoryId null = Default        (used when a category has none of its own)
 *  The dropdowns use '' for those, and toNullableId() turns '' into null on the way
 *  out. Sending 0 would create a questionnaire that matches no branch at all.
 */
eHnoteWebApp.controller('EhnoteVoiceAIQuestionnaireCtrl',
    ['$scope', 'eHnoteMasterDataService', 'eHnoteMainAppointmentService', 'eHnoteSettingsDataService', 'eHnotePatientVisitReasonServices', 'eHnoteUserAppointmentDataService', 'localStorageFactory', 'alertify',
    function ($scope, eHnoteMasterDataService, eHnoteMainAppointmentService, eHnoteSettingsDataService, eHnotePatientVisitReasonServices, eHnoteUserAppointmentDataService, localStorageFactory, alertify) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();

        $scope.ParentOrganizationId = 0;
        $scope.OrganizationId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
            $scope.ParentOrganizationId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.OrganizationId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        }
        $scope.UserId = eHnoteMasterDataService.getLoginId();

        $scope.VAQ_MAX_QUESTIONS = 5;
        $scope.VAQ_MAX_OPTIONS = 4;

        $scope.vaqView = 'list';

        $scope.vaqAnswerTypes = [
            { id: 'YesNo',          name: 'Yes / No' },
            { id: 'MultipleChoice', name: 'Multiple choice' },
            { id: 'FreeText',       name: 'Free text' }
        ];

        /*  What happens when an answer is flagged urgent. The labels are what the
            design shows; the ids are what the database stores. */
        $scope.vaqUrgentActions = [
            { id: 'ReviewOnly',     name: 'Flag for staff review' },
            { id: 'UrgentCallback', name: 'Urgent callback' },
            { id: 'Transfer',       name: 'Transfer to staff now' }
        ];

        $scope.vaqStatuses = ['All', 'Active', 'Draft', 'Inactive'];

        /* ── Dropdown data ── */

        $scope.vaqBranches = [];
        $scope.vaqVisitReasons = [];
        $scope.vaqFormVisitReasons = [];

        function loadBranches() {
            var allBranches = localStorageFactory.getItem("allBranchesData") || [];
            var locations = eHnoteUserAppointmentDataService.RestructureNewBranches(true, allBranches, doctorinfo) || [];
            $scope.vaqBranches = locations
                .filter(function (b) { return b.ClinicId !== 0; })
                .map(function (b) { return { HospitalId: b.ClinicId, HospitalName: b.ClinicName }; });
        }

        function loadVisitReasons(branchId, done) {
            eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById({
                "OrganizationId": toNullableId(branchId) || $scope.OrganizationId,
                "ReasonTypeId": 1,
                "SearchText": "",
                "VisitTypeId": null
            }).then(function (resp) {
                var d = (resp && resp.data) || {};
                var rows = (d.status === "Success" && d.rows) || [];
                var active = rows.filter(function (r) { return r.ActiveIND === 'Y'; });
                done(active);
            }, function () {
                done([]);
            });
        }

        function keepVisitReasonIfListed(list, id) {
            if (id === '' || id === null || id === undefined) { return ''; }
            for (var i = 0; i < list.length; i++) {
                if (String(list[i].ReasonId) === String(id)) { return list[i].ReasonId; }
            }
            return '';
        }

        $scope.vaqListBranchChanged = function () {
            loadVisitReasons($scope.vaqList.OrganizationId, function (rows) {
                var picked = ($scope.vaqList.VisitReasonIds || []).map(String);
                rows.forEach(function (r) { r.IsChecked = picked.indexOf(String(r.ReasonId)) !== -1; });
                $scope.vaqVisitReasons = rows;
                $scope.vaqListReasonChecked();
            });
        };

        $scope.vaqListReasonSearch = { Text: '' };

        function syncListReasonIds() {
            var picked = $scope.vaqVisitReasons
                .filter(function (r) { return r.IsChecked; })
                .map(function (r) { return r.ReasonId; });
            $scope.vaqList.VisitReasonIds = picked.length === $scope.vaqVisitReasons.length ? [] : picked;
        }

        $scope.vaqListReasonChecked = function () {
            syncListReasonIds();
            $scope.applyVaqFilter();
        };

        $scope.vaqListAllReasonsChecked = function () {
            return $scope.vaqVisitReasons.length > 0 &&
                $scope.vaqVisitReasons.every(function (r) { return r.IsChecked; });
        };

        $scope.vaqListToggleAllReasons = function () {
            var check = !$scope.vaqListAllReasonsChecked();
            $scope.vaqVisitReasons.forEach(function (r) { r.IsChecked = check; });
            $scope.vaqListReasonChecked();
        };

        $scope.vaqListReasonLabel = function () {
            var names = $scope.vaqVisitReasons
                .filter(function (r) { return r.IsChecked; })
                .map(function (r) { return r.Reason; });
            return names.length && names.length < $scope.vaqVisitReasons.length ? names.join(', ') : 'All Visit Reason';
        };

        $scope.vaqBranchChanged = function () {
            loadVisitReasons($scope.vaq.OrganizationId, function (rows) {
                var picked = ($scope.vaq.VisitReasonIds || []).map(String);
                rows.forEach(function (r) { r.IsChecked = picked.indexOf(String(r.ReasonId)) !== -1; });
                $scope.vaqFormVisitReasons = rows;
                $scope.vaqReasonChecked();
            });
        };

        $scope.vaqReasonSearch = { Text: '' };

        $scope.vaqReasonChecked = function () {
            $scope.vaq.VisitReasonIds = $scope.vaqFormVisitReasons
                .filter(function (r) { return r.IsChecked; })
                .map(function (r) { return r.ReasonId; });
        };

        $scope.vaqAllReasonsChecked = function () {
            return $scope.vaqFormVisitReasons.length > 0 &&
                $scope.vaqFormVisitReasons.every(function (r) { return r.IsChecked; });
        };

        $scope.vaqToggleAllReasons = function () {
            var check = !$scope.vaqAllReasonsChecked();
            $scope.vaqFormVisitReasons.forEach(function (r) { r.IsChecked = check; });
            $scope.vaqReasonChecked();
        };

        $scope.vaqReasonLabel = function () {
            var names = $scope.vaqFormVisitReasons
                .filter(function (r) { return r.IsChecked; })
                .map(function (r) { return r.Reason; });
            return names.length ? names.join(', ') : 'Select visit reasons';
        };

        $scope.vaqQuestionsForChanged = function () {
            if ($scope.vaq.QuestionsFor === 'General') {
                $scope.vaqFormVisitReasons.forEach(function (r) { r.IsChecked = false; });
                $scope.vaqReasonChecked();
            }
        };

        $scope.stopClosingDropDown = function (e) {
            e.stopPropagation();
        };

        /*  Who can sign a questionnaire off clinically. Doctors only - RoleId 1 and 43
            are the clinician roles the Visit Reason screen already filters on.
            DoctorID is the tblUser.UserId that ClinicalApprovedBy stores. */
        $scope.vaqClinicians = [];

        function loadClinicians() {
            eHnoteMainAppointmentService.getAllUsersByDepartmentId(
                { "BranchId": $scope.OrganizationId || 0 },
                function (resp) {
                    var rows = (resp && resp.rows) || [];
                    $scope.vaqClinicians = rows.filter(function (u) {
                        return u.RoleId === 1 || u.RoleId === 43;
                    });
                },
                function () {
                    $scope.vaqClinicians = [];
                });
        }

        $scope.vaqAnswerTypeName = function (id) {
            for (var i = 0; i < $scope.vaqAnswerTypes.length; i++) {
                if ($scope.vaqAnswerTypes[i].id === id) { return $scope.vaqAnswerTypes[i].name; }
            }
            return id || '';
        };

        $scope.vaqUrgentActionName = function (id) {
            for (var i = 0; i < $scope.vaqUrgentActions.length; i++) {
                if ($scope.vaqUrgentActions[i].id === id) { return $scope.vaqUrgentActions[i].name; }
            }
            return id || '';
        };

        /*  One line saying what makes this question urgent, for the expanded list row.
            Free text flags on keywords; the other two flag on an answer. Returns ''
            when nothing about the question is urgent, so the cell stays quiet rather
            than printing "not urgent" on most rows. */
        $scope.vaqUrgentSummary = function (q) {
            if (!q) { return ''; }

            if (q.AnswerType === 'FreeText') {
                if (!q.UrgentKeywords) { return ''; }
                return q.UrgentKeywords.split(',').join(', ')
                     + ' → ' + $scope.vaqUrgentActionName(q.KeywordUrgentAction);
            }

            var urgent = (q.Options || []).filter(function (o) { return o.IsUrgent; });
            if (!urgent.length) { return ''; }

            return urgent.map(function (o) {
                return o.OptionText + ' → ' + $scope.vaqUrgentActionName(o.UrgentAction);
            }).join(', ');
        };

        $scope.vaqVisitReasonName = function (row) {
            if (!row) { return ''; }
            return row.VisitReasonName || row.SurgeryCategoryName || 'Default';
        };

        // '' from a select means "not chosen", which for these two fields is a real
        // value - All Branches, or the Default questionnaire - and must travel as null.
        function toNullableId(v) {
            return (v === '' || v === undefined || v === null) ? null : parseInt(v, 10);
        }

        /*  input[type=date] binds a Date OBJECT. The API sends and expects the string
            "yyyy-MM-dd" (ClinicalApprovedDt is a SQL DATE). Handing the string straight
            to ng-model leaves the picker blank - which is exactly what happened on the
            edit screen - so convert at both edges. */

        function parseIsoDate(s) {
            if (!s) { return null; }
            if (s instanceof Date) { return s; }

            var parts = ('' + s).substring(0, 10).split('-');
            if (parts.length !== 3) { return null; }

            /*  Built from local parts deliberately. new Date("2026-10-13") is parsed as
                UTC midnight, which renders as the 12th for anyone west of Greenwich -
                an approval date that silently moves a day is worse than a blank one. */
            return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        }

        function toIsoDate(d) {
            var dt = (d instanceof Date) ? d : parseIsoDate(d);
            if (!dt) { return null; }
            function pad(n) { return (n < 10 ? '0' : '') + n; }
            return dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate());
        }

        /*  input[type=time] binds a Date OBJECT too, and the API sends and expects
            "HH:mm" (CallWindowStart/End are SQL TIME). Leaving the string on ng-model
            threw "[ngModel:datefmt] Expected '00:23' to be a date" and left the picker
            blank.

            This was not only cosmetic. With nothing bound, picking a time put a raw
            Date on the model, which serialised to a UTC ISO string - so 09:00 chosen in
            IST was stored as 03:30. That is where the 00:23 / 04:37 in the saved rows
            came from. Converting here keeps the clock time the user actually picked. */

        function parseTimeOfDay(s) {
            if (!s) { return null; }
            if (s instanceof Date) { return s; }

            var parts = ('' + s).split(':');
            if (parts.length < 2) { return null; }

            var h = parseInt(parts[0], 10);
            var m = parseInt(parts[1], 10);
            if (isNaN(h) || isNaN(m)) { return null; }

            // The date part is irrelevant and never sent - only the clock time is.
            return new Date(1970, 0, 1, h, m, 0, 0);
        }

        function toTimeOfDay(d) {
            var dt = (d instanceof Date) ? d : parseTimeOfDay(d);
            if (!dt) { return null; }
            function pad(n) { return (n < 10 ? '0' : '') + n; }
            // Local hours/minutes on purpose - see the note above about the UTC shift.
            return pad(dt.getHours()) + ':' + pad(dt.getMinutes());
        }

        /* ── List ── */

        $scope.vaqRows = [];
        $scope.vaqTotalCount = 0;
        $scope.vaqList = {
            OrganizationId: '',
            VisitReasonIds: [],
            Status: 'All',
            Search: '',
            PageNumber: 1,
            PageSize: 25
        };

        $scope.loadVaqList = function () {
            eHnoteMainAppointmentService.GetVoiceAIQuestionnaireList({
                "ParentOrganizationId": $scope.ParentOrganizationId,
                "OrganizationId": toNullableId($scope.vaqList.OrganizationId),
                "VisitReasonIds": ($scope.vaqList.VisitReasonIds || []).length ? $scope.vaqList.VisitReasonIds.join(',') : null,
                "Status": $scope.vaqList.Status || 'All',
                "Search": $scope.vaqList.Search || '',
                "PageNumber": $scope.vaqList.PageNumber,
                "PageSize": $scope.vaqList.PageSize
            }).then(function (resp) {
                var d = (resp && resp.data) || {};
                if (d.Status !== 'Success') {
                    alertify.error(d.Message || 'Could not load the questionnaires');
                    return;
                }
                $scope.vaqRows = d.rows || [];
                $scope.vaqTotalCount = parseInt(d.TotalCount, 10) || 0;
                // Any expansion open against the previous page is now stale.
                $scope.vaqExpanded = {};
                $scope.vaqQuestionCache = {};
            }, function () {
                alertify.error('Could not load the questionnaires');
            });
        };

        /* ── Questions inline on the list ──
           The grid does not carry the questions - only a count - so each expansion is
           its own Detail read, done on demand and then cached. Pulling every row's
           questions up front would be one call per row for something most rows never
           get expanded. The caches are cleared whenever the list reloads, so an edit
           can never leave a stale set open underneath it. */

        $scope.vaqExpanded = {};          // QuestionnaireId -> true
        $scope.vaqQuestionCache = {};     // QuestionnaireId -> questions[]
        $scope.vaqLoadingQuestions = {};

        $scope.toggleVaqQuestions = function (row) {
            var id = row.QuestionnaireId;

            if ($scope.vaqExpanded[id]) {
                $scope.vaqExpanded[id] = false;
                return;
            }
            $scope.vaqExpanded[id] = true;

            if ($scope.vaqQuestionCache[id]) { return; }

            $scope.vaqLoadingQuestions[id] = true;
            eHnoteMainAppointmentService.GetVoiceAIQuestionnaire({
                "QuestionnaireId": id,
                "UserId": $scope.UserId
            }).then(function (resp) {
                $scope.vaqLoadingQuestions[id] = false;
                var d = (resp && resp.data) || {};
                if (d.Status !== 'Success') {
                    $scope.vaqExpanded[id] = false;
                    alertify.error(d.Message || 'Could not load the questions');
                    return;
                }
                $scope.vaqQuestionCache[id] = d.Questions || [];
            }, function () {
                $scope.vaqLoadingQuestions[id] = false;
                $scope.vaqExpanded[id] = false;
                alertify.error('Could not load the questions');
            });
        };

        $scope.applyVaqFilter = function () {
            $scope.vaqList.PageNumber = 1;
            $scope.loadVaqList();
        };

        $scope.clearVaqFilter = function () {
            $scope.vaqList.OrganizationId = '';
            $scope.vaqListReasonSearch.Text = '';
            $scope.vaqVisitReasons.forEach(function (r) { r.IsChecked = false; });
            syncListReasonIds();
            $scope.vaqList.Status = 'All';
            $scope.vaqList.Search = '';
            $scope.vaqList.PageNumber = 1;
            $scope.loadVaqList();
        };

        /* ── Add / edit ── */

        function blankOption(text) {
            return { OptionId: 0, OptionText: text || '', IsUrgent: false, UrgentAction: null };
        }

        function blankQuestion() {
            return {
                QuestionId: 0,
                QuestionText: '',
                AnswerType: 'YesNo',
                IsRequired: true,
                UrgentKeywords: '',
                KeywordUrgentAction: null,
                KeywordList: [],
                KeywordDraft: '',
                // Yes/No is stored as two real options so that "which answer is urgent"
                // works the same way for every answer type.
                Options: [blankOption('Yes'), blankOption('No')]
            };
        }

        function blankQuestionnaire() {
            return {
                QuestionnaireId: 0,
                OrganizationId: '',
                QuestionsFor: 'General',
                VisitReasonIds: [],
                CallAfterDays: 1,
                CallWindowStart: parseTimeOfDay('09:00'),
                CallWindowEnd: parseTimeOfDay('19:00'),
                RetryCount: 2,
                RetryGapHours: 3,
                LeaveVoicemail: true,
                IsActive: false,
                ClinicalApprovedBy: null,
                ClinicalApprovedByName: '',
                ClinicalApprovedDt: null,
                Questions: [blankQuestion()],
                saving: false
            };
        }

        $scope.openVaqAdd = function () {
            $scope.vaq = blankQuestionnaire();
            $scope.vaqView = 'edit';
            $scope.vaqBranchChanged();
        };

        $scope.openVaqEdit = function (row) {
            eHnoteMainAppointmentService.GetVoiceAIQuestionnaire({
                "QuestionnaireId": row.QuestionnaireId,
                "UserId": $scope.UserId
            }).then(function (resp) {
                var d = (resp && resp.data) || {};
                if (d.Status !== 'Success') {
                    alertify.error(d.Message || 'Could not open the questionnaire');
                    return;
                }

                var q = {
                    QuestionnaireId: d.QuestionnaireId,
                    /*  Two conversions, both load-bearing:
                        - null comes back as All Branches / Default; the selects speak ''
                        - the options are built with ng-repeat, so their values are
                          STRINGS. Binding a number here matches no option and the
                          dropdown renders blank on every edit. */
                    OrganizationId: (d.OrganizationId === null || d.OrganizationId === undefined)
                                    ? '' : String(d.OrganizationId),
                    QuestionsFor: d.VisitReasonIds || (d.VisitReasonId !== null && d.VisitReasonId !== undefined) ? 'VisitReason' : 'General',
                    VisitReasonIds: d.VisitReasonIds
                                    ? String(d.VisitReasonIds).split(',').map(function (x) { return x.trim(); }).filter(function (x) { return x; })
                                    : ((d.VisitReasonId === null || d.VisitReasonId === undefined) ? [] : [d.VisitReasonId]),
                    CallAfterDays: d.CallAfterDays,
                    // "09:00" from the API -> a Date the time picker can show.
                    CallWindowStart: parseTimeOfDay(d.CallWindowStart),
                    CallWindowEnd: parseTimeOfDay(d.CallWindowEnd),
                    RetryCount: d.RetryCount,
                    RetryGapHours: d.RetryGapHours,
                    LeaveVoicemail: !!d.LeaveVoicemail,
                    IsActive: !!d.IsActive,
                    ClinicalApprovedBy: d.ClinicalApprovedBy,
                    ClinicalApprovedByName: d.ClinicalApprovedByName || '',
                    // "2026-10-13" from the API -> a Date the picker can show.
                    ClinicalApprovedDt: parseIsoDate(d.ClinicalApprovedDt),
                    Questions: [],
                    saving: false
                };

                var rows = d.Questions || [];
                for (var i = 0; i < rows.length; i++) {
                    var s = rows[i];
                    q.Questions.push({
                        QuestionId: s.QuestionId,
                        QuestionText: s.QuestionText,
                        AnswerType: s.AnswerType,
                        IsRequired: !!s.IsRequired,
                        UrgentKeywords: s.UrgentKeywords || '',
                        KeywordUrgentAction: s.KeywordUrgentAction || null,
                        KeywordList: splitKeywords(s.UrgentKeywords),
                        KeywordDraft: '',
                        Options: (s.Options || []).map(function (o) {
                            return {
                                OptionId: o.OptionId,
                                OptionText: o.OptionText,
                                IsUrgent: !!o.IsUrgent,
                                UrgentAction: o.UrgentAction || null
                            };
                        })
                    });
                }

                if (!q.Questions.length) { q.Questions.push(blankQuestion()); }

                $scope.vaq = q;
                $scope.vaqView = 'edit';
                $scope.vaqBranchChanged();
            }, function () {
                alertify.error('Could not open the questionnaire');
            });
        };

        $scope.closeVaqEdit = function () {
            $scope.vaqView = 'list';
            $scope.loadVaqList();
        };

        /* ── Questions on the edit form ── */

        $scope.vaqQuestionsRemaining = function () {
            if (!$scope.vaq || !$scope.vaq.Questions) { return 0; }
            return $scope.VAQ_MAX_QUESTIONS - $scope.vaq.Questions.length;
        };

        $scope.addVaqQuestion = function () {
            if ($scope.vaqQuestionsRemaining() <= 0) { return; }
            $scope.vaq.Questions.push(blankQuestion());
        };

        $scope.removeVaqQuestion = function (index) {
            $scope.vaq.Questions.splice(index, 1);
            // Never leave the form with nothing to fill in.
            if (!$scope.vaq.Questions.length) { $scope.vaq.Questions.push(blankQuestion()); }
        };

        $scope.moveVaqQuestion = function (index, delta) {
            var to = index + delta;
            if (to < 0 || to >= $scope.vaq.Questions.length) { return; }
            var moved = $scope.vaq.Questions.splice(index, 1)[0];
            $scope.vaq.Questions.splice(to, 0, moved);
        };

        /*  Changing the answer type changes what an option even means, so the old
            options cannot be carried across unchanged. Multiple choice keeps what is
            already usable rather than wiping the staff member's typing. */
        $scope.vaqAnswerTypeChanged = function (q) {
            if (q.AnswerType === 'YesNo') {
                q.Options = [blankOption('Yes'), blankOption('No')];
            } else if (q.AnswerType === 'FreeText') {
                q.Options = [];
            } else {
                var usable = (q.Options || []).filter(function (o) {
                    return o.OptionText && o.OptionText !== 'Yes' && o.OptionText !== 'No';
                });
                q.Options = usable.length >= 2 ? usable.slice(0, $scope.VAQ_MAX_OPTIONS)
                                               : [blankOption(''), blankOption('')];
            }

            if (q.AnswerType !== 'FreeText') {
                q.KeywordList = [];
                q.KeywordDraft = '';
                q.KeywordUrgentAction = null;
            }
        };

        $scope.addVaqOption = function (q) {
            if (q.Options.length >= $scope.VAQ_MAX_OPTIONS) { return; }
            q.Options.push(blankOption(''));
        };

        $scope.removeVaqOption = function (q, index) {
            if (q.Options.length <= 2) {
                alertify.error('A multiple choice question needs at least two options');
                return;
            }
            q.Options.splice(index, 1);
        };

        // An action only means something alongside urgency, and the database rejects
        // the pair any other way round.
        $scope.vaqUrgentChanged = function (o) {
            if (!o.IsUrgent) { o.UrgentAction = null; }
            else if (!o.UrgentAction) { o.UrgentAction = 'ReviewOnly'; }
        };

        /* ── Free-text keywords, entered as chips ── */

        function splitKeywords(s) {
            if (!s) { return []; }
            return ('' + s).split(',').map(function (k) { return k.trim(); })
                           .filter(function (k) { return k.length > 0; });
        }

        $scope.addVaqKeyword = function (q) {
            var k = (q.KeywordDraft || '').trim();
            if (!k) { return; }
            if (q.KeywordList.indexOf(k) === -1) { q.KeywordList.push(k); }
            q.KeywordDraft = '';
            if (!q.KeywordUrgentAction) { q.KeywordUrgentAction = 'ReviewOnly'; }
        };

        $scope.removeVaqKeyword = function (q, index) {
            q.KeywordList.splice(index, 1);
        };

        // Enter or comma commits the keyword. preventDefault stops Enter submitting
        // the surrounding settings form and losing the whole screen.
        $scope.onVaqKeywordKey = function ($event, q) {
            if ($event.keyCode === 13 || $event.keyCode === 188) {
                $event.preventDefault();
                $scope.addVaqKeyword(q);
            }
        };

        /* ── Call preview ──
           What the assistant will say, in order. The greeting and sign-off are fixed
           wording from the call script, shown so the questions are read in context. */

        /*  Held as plain scope values and rebuilt by the watch below - NOT returned
            from a function bound in the template.

            ng-repeat="line in vaqPreviewLines()" called the function on every digest,
            and it handed back a brand new array of brand new objects each time. Angular
            compares by identity, saw a change every pass, and looped until it gave up:
            "[$rootScope:infdig] 10 $digest() iterations reached". Watching a cheap
            string instead means the array is only rebuilt when the questions change. */

        $scope.vaqPreview = [];
        $scope.vaqPreviewMinutes = 1;

        function rebuildVaqPreview() {
            var lines = [];

            if (!$scope.vaq || !$scope.vaq.Questions) {
                $scope.vaqPreview = lines;
                $scope.vaqPreviewMinutes = 1;
                return;
            }

            lines.push({ kind: 'say',  text: 'Hi, this is Mara calling from [Clinic Name] to check on you after your procedure. Am I speaking with [Patient Name]?' });
            lines.push({ kind: 'note', text: 'Confirms name and date of birth before going on.' });

            var answered = 0;
            for (var i = 0; i < $scope.vaq.Questions.length; i++) {
                var t = ($scope.vaq.Questions[i].QuestionText || '').trim();
                if (t) {
                    lines.push({ kind: 'say', text: t });
                    answered++;
                }
            }

            lines.push({ kind: 'say', text: 'Thank you. If anything changes, please call us at [Clinic Phone]. Take care.' });

            $scope.vaqPreview = lines;
            // Roughly 12 seconds per exchange plus the fixed greeting and sign-off.
            // Shown as "about N minutes" precisely because it is an estimate.
            $scope.vaqPreviewMinutes = Math.max(1, Math.round((45 + answered * 12) / 60));
        }

        // A string, so the watch is stable and settles after one pass.
        $scope.$watch(function () {
            if (!$scope.vaq || !$scope.vaq.Questions) { return ''; }
            return $scope.vaq.Questions.map(function (q) {
                return q.QuestionText || '';
            }).join('\u0001');
        }, rebuildVaqPreview);

        /* ── Clinical approval ──
           Two fields, per the design: who approved and on what date. Both are the
           questionnaire's own record of the sign-off, not the current user - the person
           filling the screen in is often not the clinician approving it. */

        // Picking a clinician with no date yet defaults the date to today, because
        // that is the case every time and re-typing it is friction for nothing.
        $scope.vaqApproverChanged = function () {
            if ($scope.vaq.ClinicalApprovedBy && !$scope.vaq.ClinicalApprovedDt) {
                $scope.vaq.ClinicalApprovedDt = new Date();
            }
            if (!$scope.vaq.ClinicalApprovedBy) {
                $scope.vaq.ClinicalApprovedDt = null;
                /*  Approval is what permits Active. Clearing the clinician while the
                    Active box is ticked would leave it ticked but disabled, and the
                    save would then be rejected by the proc for a reason the screen
                    never showed. Untick it here, where the user can see it happen. */
                $scope.vaq.IsActive = false;
            }
        };

        $scope.vaqIsApproved = function () {
            return !!($scope.vaq && $scope.vaq.ClinicalApprovedBy);
        };

        /* ── Save ── */

        /*  Two save buttons, per the design, alongside the Active checkbox in Details.
            The button wins: it writes IsActive before saving, and because the checkbox
            is bound to that same field the user SEES it move rather than having their
            tick silently overridden.

            activate = true is refused below when no clinician has approved, and again
            by the proc, and again by a check constraint on the table. */
        $scope.saveVaq = function (activate) {
            var v = $scope.vaq;
            v.IsActive = !!activate;

            if (v.QuestionsFor === 'VisitReason' && !(v.VisitReasonIds || []).length) {
                alertify.error('Select at least one visit reason');
                return;
            }

            for (var i = 0; i < v.Questions.length; i++) {
                var q = v.Questions[i];
                if (!(q.QuestionText || '').trim()) {
                    alertify.error('Question ' + (i + 1) + ' needs its text');
                    return;
                }
                if (q.AnswerType === 'MultipleChoice') {
                    var filled = q.Options.filter(function (o) { return (o.OptionText || '').trim(); });
                    if (filled.length < 2) {
                        alertify.error('Question ' + (i + 1) + ' needs at least two options');
                        return;
                    }
                }
            }

            if (v.IsActive && !v.ClinicalApprovedBy) {
                alertify.error('Choose the approving clinician before activating. Save as draft instead.');
                return;
            }

            // An approver with no date would save a sign-off nobody can put in time.
            if (v.ClinicalApprovedBy && !v.ClinicalApprovedDt) {
                alertify.error('Enter the approval date');
                return;
            }

            var payload = {
                "QuestionnaireId": v.QuestionnaireId || 0,
                "ParentOrganizationId": $scope.ParentOrganizationId,
                "OrganizationId": toNullableId(v.OrganizationId),
                "VisitReasonIds": v.QuestionsFor === 'VisitReason' && (v.VisitReasonIds || []).length ? v.VisitReasonIds.join(',') : null,
                "CallAfterDays": parseInt(v.CallAfterDays, 10) || 0,
                // Date -> "HH:mm" for the SQL TIME columns.
                "CallWindowStart": toTimeOfDay(v.CallWindowStart),
                "CallWindowEnd": toTimeOfDay(v.CallWindowEnd),
                "RetryCount": parseInt(v.RetryCount, 10) || 0,
                "RetryGapHours": parseInt(v.RetryGapHours, 10) || 1,
                "LeaveVoicemail": !!v.LeaveVoicemail,
                "IsActive": !!v.IsActive,
                "ClinicalApprovedBy": v.ClinicalApprovedBy || null,
                // Date -> "yyyy-MM-dd" for the SQL DATE column.
                "ClinicalApprovedDt": toIsoDate(v.ClinicalApprovedDt),
                "UserId": $scope.UserId,
                "Questions": v.Questions.map(function (q, qi) {
                    return {
                        "QuestionId": q.QuestionId || 0,
                        // Position on screen is the order the assistant asks in.
                        "SortOrder": qi + 1,
                        "QuestionText": (q.QuestionText || '').trim(),
                        "AnswerType": q.AnswerType,
                        "IsRequired": !!q.IsRequired,
                        "UrgentKeywords": q.AnswerType === 'FreeText' && q.KeywordList.length
                                          ? q.KeywordList.join(',') : null,
                        "KeywordUrgentAction": q.AnswerType === 'FreeText' && q.KeywordList.length
                                          ? q.KeywordUrgentAction : null,
                        "Options": q.AnswerType === 'FreeText' ? [] :
                            q.Options
                             .filter(function (o) { return (o.OptionText || '').trim(); })
                             .map(function (o, oi) {
                                 return {
                                     "OptionId": o.OptionId || 0,
                                     "SortOrder": oi + 1,
                                     "OptionText": (o.OptionText || '').trim(),
                                     "IsUrgent": !!o.IsUrgent,
                                     "UrgentAction": o.IsUrgent ? o.UrgentAction : null
                                 };
                             })
                    };
                })
            };

            v.saving = true;
            eHnoteMainAppointmentService.SaveVoiceAIQuestionnaire(payload).then(function (resp) {
                v.saving = false;
                var d = (resp && resp.data) || {};
                if (d.Status !== 'Success') {
                    alertify.error(d.Message || 'Could not save the questionnaire');
                    return;
                }
                alertify.success(d.Message || 'Questionnaire saved');
                $scope.closeVaqEdit();
            }, function () {
                v.saving = false;
                alertify.error('Could not save the questionnaire');
            });
        };

        /* ── Row actions ── */

        $scope.toggleVaqStatus = function (row) {
            eHnoteMainAppointmentService.UpdateVoiceAIQuestionnaireStatus({
                "QuestionnaireId": row.QuestionnaireId,
                "UserId": $scope.UserId,
                "IsActive": !row.IsActive
            }).then(function (resp) {
                var d = (resp && resp.data) || {};
                if (d.Status !== 'Success') {
                    alertify.error(d.Message || 'Could not update the questionnaire');
                    return;
                }
                alertify.success(d.Message);
                $scope.loadVaqList();
            }, function () {
                alertify.error('Could not update the questionnaire');
            });
        };

        $scope.deleteVaq = function (row) {
            alertify.confirm('Delete the questionnaire for ' + $scope.vaqVisitReasonName(row) + '?',
                function () {
                    eHnoteMainAppointmentService.DeleteVoiceAIQuestionnaire({
                        "QuestionnaireId": row.QuestionnaireId,
                        "UserId": $scope.UserId
                    }).then(function (resp) {
                        var d = (resp && resp.data) || {};
                        if (d.Status !== 'Success') {
                            alertify.error(d.Message || 'Could not delete the questionnaire');
                            return;
                        }
                        alertify.success(d.Message);
                        $scope.loadVaqList();
                    }, function () {
                        alertify.error('Could not delete the questionnaire');
                    });
                });
        };

        /* ── Copy to other branches ── */

        $scope.vaqCopy = { show: false };

        $scope.openVaqCopy = function (row) {
            $scope.vaqCopy = {
                show: true,
                source: row,
                targets: {},        // HospitalId -> true
                saving: false
            };
        };

        $scope.closeVaqCopy = function () { $scope.vaqCopy = { show: false }; };

        $scope.vaqCopySelectedIds = function () {
            var ids = [];
            for (var k in $scope.vaqCopy.targets) {
                if ($scope.vaqCopy.targets[k]) { ids.push(k); }
            }
            return ids;
        };

        $scope.confirmVaqCopy = function () {
            var ids = $scope.vaqCopySelectedIds();
            if (!ids.length) {
                alertify.error('Choose at least one location');
                return;
            }

            $scope.vaqCopy.saving = true;
            eHnoteMainAppointmentService.CopyVoiceAIQuestionnaireToBranch({
                "QuestionnaireId": $scope.vaqCopy.source.QuestionnaireId,
                "UserId": $scope.UserId,
                "TargetOrganizationIds": ids.join(',')
            }).then(function (resp) {
                $scope.vaqCopy.saving = false;
                var d = (resp && resp.data) || {};
                if (d.Status !== 'Success') {
                    alertify.error(d.Message || 'Could not copy the questionnaire');
                    return;
                }
                alertify.success(d.Message);
                $scope.closeVaqCopy();
                $scope.loadVaqList();
            }, function () {
                $scope.vaqCopy.saving = false;
                alertify.error('Could not copy the questionnaire');
            });
        };

        loadBranches();
        loadVisitReasons('', function (rows) {
            $scope.vaqVisitReasons = rows;
            $scope.vaqListReasonChecked();
        });
        loadClinicians();
    }]);
