const translations = {
    ar: {
        // Login Page
        "login_title": "تسجيل الدخول - نظام الاختبارات",
        "system_title": "🎓 نظام الاختبارات",
        "welcome_msg": "مرحباً بك في نظام الاختبارات الإلكتروني",
        "student_tab": "طالب",
        "admin_tab": "مسؤول",
        "email_label": "البريد الإلكتروني",
        "password_label": "كلمة المرور",
        "student_login_btn": "🔐 تسجيل الدخول",
        "no_account": "ليس لديك حساب؟",
        "register_now": "سجل الآن",
        "teacher_email_placeholder": "teacher@school.com",
        "admin_login_btn": "🔑 دخول المسؤول",
        "login_success": "✅ تم تسجيل الدخول بنجاح! جاري التحويل...",
        "admin_login_success": "✅ تم تسجيل دخول المسؤول! جاري التحويل...",
        "login_fail": "❌ فشل تسجيل الدخول",
        "server_error": "❌ حدث خطأ في الاتصال بالخادم",

        // Admin Dashboard
        "admin_dashboard_title": "لوحة تحكم المسؤول",
        "admin_header_title": "👨‍💼 لوحة تحكم المسؤول",
        "logout_btn": "🚪 تسجيل الخروج",
        "total_questions": "إجمالي الأسئلة",
        "total_students": "عدد الطلاب",
        "completed_exams": "الاختبارات المكتملة",
        "pending_essays": "مقاليات قيد التصحيح",
        "manage_exams_title": "إدارة الاختبارات",
        "manage_exams_desc": "إضافة، تعديل، أو حذف الاختبارات",
        "manage_exams_btn": "إدارة الاختبارات",
        "manage_questions_title": "إدارة الأسئلة",
        "manage_questions_desc": "إضافة، تعديل، أو حذف الأسئلة",
        "manage_questions_btn": "إدارة الأسئلة",
        "grade_essays_title": "تصحيح المقاليات",
        "grade_essays_desc": "راجع وصحح الأسئلة المقالية",
        "grade_essays_btn": "بدء التصحيح",
        "manage_admins_title": "إدارة المسؤولين",
        "manage_admins_desc": "إضافة أو حذف مسؤولين فرعيين",
        "manage_admins_btn": "إدارة المسؤولين",
        "recent_results_title": "📊 نتائج الطلاب الأخيرة",
        "th_student": "الطالب",
        "th_auto_score": "الدرجة التلقائية",
        "th_essay_score": "درجة المقاليات",
        "th_final_score": "الدرجة النهائية",
        "th_status": "الحالة",
        "th_date": "التاريخ",
        "no_results": "لا توجد نتائج بعد",
        "passed": "ناجح",
        "failed": "راسب",
        "pending_grading": "⏳ قيد التصحيح",
        "logout_confirm": "هل تريد تسجيل الخروج؟",
        "must_be_admin": "يجب تسجيل الدخول كمسؤول",

        // Student Dashboard
        "student_dashboard_title": "لوحة الطالب - نظام الاختبارات",
        "student_header_title": "🎓 لوحة الطالب",
        "welcome_prefix": "مرحباً",
        "info_title": "💡 معلومة",
        "stat_completed_exams": "اختبارات مكتملة",
        "stat_average": "المعدل",
        "stat_pending": "قيد التصحيح",
        "card_exams_title": "الاختبارات",
        "card_exams_desc": "تصفح واختر من الاختبارات المتاحة لك",
        "card_exams_btn": "عرض الاختبارات",
        "card_results_title": "نتائجي",
        "card_results_desc": "شاهد نتائجك التفصيلية، الدرجات النهائية، وتعليقات المعلم على إجاباتك",
        "card_results_btn": "عرض النتائج",
        "pending_grading_msg": "لديك {count} اختبار قيد التصحيح. سيتم إشعارك عند الانتهاء من تصحيح الأسئلة المقالية.",
        "must_login": "يجب تسجيل الدخول أولاً",

        // Register Page
        "register_title": "تسجيل حساب جديد - نظام الاختبارات",
        "register_header": "📝 تسجيل حساب جديد",
        "register_subtitle": "انضم إلينا كطالب أو كمعلم",
        "teacher_tab": "معلم",
        "full_name_label": "الاسم الكامل",
        "choose_teachers_label": "اختر المعلمين (اختياري)",
        "loading_teachers": "⏳ جارٍ تحميل قائمة المعلمين...",
        "teachers_helper": "💡 يمكنك اختيار معلم واحد أو أكثر، أو تخطي هذه الخطوة والاختيار لاحقاً",
        "register_student_btn": "✅ تسجيل كطالب",
        "register_teacher_btn": "👨‍🏫 تسجيل كمعلم",
        "already_have_account": "لديك حساب بالفعل؟",
        "login_link": "سجل الدخول",
        "no_teachers": "📭 لا يوجد معلمين متاحين حالياً",
        "fail_load_teachers": "❌ فشل تحميل قائمة المعلمين",
        "register_success_student": "✅ تم تسجيل حساب الطالب بنجاح!",
        "register_success_teacher": "✅ تم تسجيل حساب المعلم بنجاح!",
        "register_error": "حدث خطأ أثناء التسجيل",
        "connection_error": "خطأ في الاتصال بالخادم",
        "linked_with_teachers": " (تم الربط مع {count} معلم)",

        // Manage Exams Page
        "manage_exams_page_title": "إدارة الاختبارات",
        "back_to_dashboard": "← لوحة التحكم",
        "your_exams_title": "الاختبارات الخاصة بك",
        "add_exam_btn": "➕ إضافة اختبار جديد",
        "th_exam_name": "اسم الاختبار",
        "th_description": "الوصف",
        "th_duration": "المدة (دقيقة)",
        "th_passing_score": "درجة النجاح",
        "th_created_date": "تاريخ الإنشاء",
        "th_actions": "إجراءات",
        "btn_questions": "الأسئلة",
        "btn_edit": "تعديل",
        "btn_delete": "حذف",
        "no_exams_msg": "لا توجد اختبارات. ابدأ بإضافة واحد!",
        "loading": "جاري التحميل...",
        "modal_add_title": "إضافة اختبار",
        "modal_edit_title": "تعديل اختبار",
        "label_exam_title": "عنوان الاختبار",
        "label_description": "الوصف (أو اسم المادة)",
        "label_duration": "المدة (دقيقة)",
        "label_passing_score": "درجة النجاح",
        "btn_cancel": "إلغاء",
        "btn_save": "حفظ",
        "save_success": "تم الحفظ بنجاح",
        "error_occurred": "حدث خطأ",
        "confirm_delete": "هل أنت متأكد؟",

        // Super Admin Dashboard (super-admin.html)
        "super_admin_dashboard_title": "لوحة تحكم المشرف العام",
        "super_admin_header": "🛡️ لوحة تحكم المشرف العام",
        "super_admin_subtitle": "إدارة المعلمين والاشتراكات",
        "th_teacher": "المعلم",
        "th_email": "البريد الإلكتروني",
        "th_plan": "الخطة",
        "th_status": "الحالة",
        "th_exams": "الامتحانات",
        "btn_details": "تفاصيل",
        "confirm_delete_teacher": "هل أنت متأكد من حذف هذا المعلم؟",

        // Manage Admins Page (manage-admins.html)
        "manage_admins_title": "إدارة المسؤولين",
        "manage_admins_header": "🛡️ إدارة المسؤولين",
        "admins_list_title": "قائمة المسؤولين",
        "add_admin_btn": "➕ إضافة مسؤول جديد",
        "th_name": "الاسم",
        "th_username": "اسم المستخدم",
        "th_password": "كلمة المرور",
        "no_admins_msg": "لا يوجد مسؤولين فرعيين مضافين",
        "modal_add_admin_title": "إضافة مسؤول جديد",
        "label_full_name": "الاسم الكامل",
        "label_username": "اسم المستخدم",
        "label_password": "كلمة المرور",
        "btn_save_admin": "💾 حفظ المسؤول",
        "admin_added_success": "✅ تم إضافة المسؤول بنجاح",
        "confirm_delete_admin": "هل أنت متأكد من حذف هذا المسؤول؟",
        "only_super_admin": "عذراً، هذه الصفحة مخصصة للمسؤول الرئيسي فقط",
        "active_status": "✅ نشط",
        "inactive_status": "❌ غير نشط",
        "fetch_error": "حدث خطأ أثناء تحميل البيانات",

        // Teacher Details (teacher-details.html)
        "teacher_details_title": "تفاصيل المعلم",
        "teacher_details_header": "👨‍🏫 تفاصيل المعلم",
        "teacher_info_card": "معلومات المعلم",
        "label_name": "الاسم:",
        "label_plan": "الخطة:",
        "label_status": "الحالة:",
        "label_exams_count": "عدد الامتحانات:",
        "label_students_count": "عدد الطلاب:",
        "actions_card": "الإجراءات",
        "btn_suspend": "🔒 إيقاف الحساب",
        "btn_activate": "🔓 تفعيل الحساب",
        "btn_reset_pass": "🔑 إعادة تعيين كلمة المرور",
        "btn_delete_teacher": "🗑️ حذف الحساب",
        "recent_activity_card": "آخر النشاطات",
        "activity_login": "تسجيل دخول",
        "activity_create_exam": "إنشاء امتحان",
        "months_map": {
            "1": "يناير", "2": "فبراير", "3": "مارس", "4": "أبريل", "5": "مايو", "6": "يونيو",
            "7": "يوليو", "8": "أغسطس", "9": "سبتمبر", "10": "أكتوبر", "11": "نوفمبر", "12": "ديسمبر"
        },
        "confirm_suspend": "هل أنت متأكد من إيقاف هذا الحساب؟",
        "confirm_activate": "هل أنت متأكد من تفعيل هذا الحساب؟",
        "confirm_reset_pass": "هل أنت متأكد من إعادة تعيين كلمة المرور؟",
        "pass_reset_success": "تم إعادة تعيين كلمة المرور بنجاح. الكلمة الجديدة: ",
        "action_success": "تم تنفيذ الإجراء بنجاح",
        "back_to_list": "← العودة للقائمة",
        "subscription_info": "معلومات الاشتراك",
        "stats": "الإحصائيات",
        "edit_teacher_settings": "تعديل إعدادات المعلم",
        "max_students": "الحد الأقصى للطلاب",
        "max_exams": "الحد الأقصى للامتحانات",
        "btn_save_changes": "💾 حفظ التعديلات",
        "btn_edit_settings": "✏️ تعديل الإعدادات",
        "missing_teacher_id": "لم يتم تحديد معرف المعلم",
        "unlimited": "غير محدود",
        "never": "أبداً",

        // Exams List (exams-list.html)
        "available_exams_title": "الخطة الدراسية",
        "available_exams_header": "📚 الخطة الدراسية",
        "no_exams_msg": "لا توجد مواد حالياً",
        "exam_duration": "⏱️ المدة: ",
        "passing_score": "🎯 النجاح: ",
        "start_exam_btn": "▶️ دخول المادة",
        "minutes": "دقيقة",

        // Quiz (quiz.html)
        "quiz_page_title": "الاختبار",
        "home_tooltip": "العودة للصفحة الرئيسية",
        "welcome_user": "مرحباً بك",
        "time_remaining": "الوقت المتبقي:",
        "student_name_label": "اسم الطالب:",
        "student_name_placeholder": "اكتب اسمك",
        "submit_quiz_btn": "إنهاء الاختبار",
        "confirm_submit_quiz": "هل أنت متأكد أنك تريد إنهاء الاختبار؟",
        "time_up_msg": "انتهى الوقت! سيتم تسليم إجاباتك الآن.",

        // Student Results (student-results.html)
        "my_results_title": "نتائجي - نظام الاختبارات",
        "my_results_header": "📊 نتائجي",
        "final_result_title": "النتيجة النهائية",
        "auto_score_label": "📝 الدرجة التلقائية:",
        "essay_score_label": "✍️ درجة الأسئلة المقالية:",
        "final_score_label": "🎯 الدرجة النهائية:",
        "essay_pending_msg": "📝 الأسئلة المقالية قيد التصحيح...",
        "status_pass": "🎉 ناجح",
        "status_fail": "❌ راسب",
        "teacher_feedback_title": "📝 تصحيح المعلم",
        "your_score": "درجتك:",
        "pending_grading_title": "⏳ جاري تصحيح الأسئلة المقالية",
        "pending_grading_msg": "سيتم إشعارك عند الانتهاء من التصحيح",
        "submission_date": "تاريخ التسليم:",
        "no_results_msg": "لم تقم بحل الاختبار بعد",
        "solve_exam_first": "قم بحل الاختبار أولاً لمشاهدة نتائجك",

        // Teacher Dashboard (teacher-dashboard.html)
        "teacher_dashboard_title": "لوحة تحكم المعلم",
        "teacher_header": "👨‍🏫 لوحة تحكم المعلم",
        "stat_active_exams": "الامتحانات النشطة",
        "stat_registered_students": "الطلاب المسجلين",
        "stat_student_answers": "إجابات الطلاب",
        "stat_pending_essays": "مقاليات قيد التصحيح",
        "action_manage_exams": "📚 إدارة الاختبارات",
        "action_manage_exams_desc": "إنشاء وتعديل الاختبارات والأسئلة",
        "action_manage_students": "👥 إدارة الطلاب",
        "action_manage_students_desc": "إضافة طلاب وعرض النتائج",
        "action_grade_essays": "📝 تصحيح المقاليات",
        "action_grade_essays_desc": "مراجعة الإجابات المقالية",

        // Essay Review (essay-review.html)
        "essay_review_title": "تصحيح الأسئلة المقالية",
        "essay_review_header": "📝 تصحيح الأسئلة المقالية",
        "nav_manage_questions": "إدارة الأسئلة",
        "stat_total_students": "إجمالي الطلاب",
        "stat_pending": "قيد الانتظار",
        "stat_graded": "تم التصحيح",
        "filter_all": "جميع الطلاب",
        "filter_pending": "قيد الانتظار",
        "filter_graded": "تم التصحيح",
        "btn_refresh": "🔄 تحديث",
        "no_submissions_msg": "لا توجد إجابات للتصحيح",
        "no_submissions_desc": "لم يقم أي طالب بحل الأسئلة المقالية بعد",
        "grade_label": "الدرجة:",
        "comment_label": "التعليق:",
        "comment_placeholder": "أضف ملاحظاتك هنا (اختياري)...",
        "btn_save_grades": "💾 حفظ الدرجات",
        "badge_graded": "✅ تم التصحيح",
        "badge_pending": "⏳ قيد الانتظار",
        "no_essay_questions": "لا توجد أسئلة مقالية",
        "student_answer_label": "إجابة الطالب:",
        "not_answered": "لم يتم الإجابة",
        "grades_saved_success": "✅ تم حفظ الدرجات بنجاح وإرسالها لـ Google Sheets!",
        "grades_saved_local": "✅ تم حفظ الدرجات محلياً (قد يكون هناك مشكلة في الاتصال بـ Google Sheets)",
        "invalid_grade_error": "الدرجة غير صحيحة",

        // Manage Students (manage-students.html)
        "manage_students_title": "إدارة الطلاب",
        "manage_students_header": "👥 إدارة الطلاب",
        "btn_back_dashboard": "العودة للوحة التحكم",
        "search_placeholder": "🔍 البحث عن طالب...",
        "add_student_btn": "➕ إضافة طالب جديد",
        "students_list_title": "قائمة الطلاب",
        "th_registration_date": "تاريخ التسجيل",
        "th_completed_exams": "الاختبارات المكتملة",
        "th_average_score": "المعدل",
        "no_students_msg": "لا توجد طلاب حالياً",
        "modal_add_student": "إضافة طالب جديد",
        "modal_edit_student": "تعديل بيانات الطالب",
        "label_email": "البريد الإلكتروني",
        "password_hint": "(اتركها فارغة للإبقاء على القديمة)",
        "confirm_delete_student": "هل أنت متأكد من حذف هذا الطالب؟\nسيتم حذف جميع النتائج والبيانات المرتبطة به.",
        "delete_success": "تم الحذف بنجاح",
        "delete_fail": "فشل في حذف الطالب"
    },
    en: {
        // Login Page
        "login_title": "Login - Quiz System",
        "system_title": "🎓 Quiz System",
        "welcome_msg": "Welcome to the Online Quiz System",
        "student_tab": "Student",
        "admin_tab": "Admin",
        "email_label": "Email",
        "password_label": "Password",
        "student_login_btn": "🔐 Login",
        "no_account": "Don't have an account?",
        "register_now": "Register Now",
        "teacher_email_placeholder": "teacher@school.com",
        "admin_login_btn": "🔑 Admin Login",
        "login_success": "✅ Login successful! Redirecting...",
        "admin_login_success": "✅ Admin login successful! Redirecting...",
        "login_fail": "❌ Login failed",
        "server_error": "❌ Connection error",

        // Admin Dashboard
        "admin_dashboard_title": "Admin Dashboard",
        "admin_header_title": "👨‍💼 Admin Dashboard",
        "logout_btn": "🚪 Logout",
        "total_questions": "Total Questions",
        "total_students": "Total Students",
        "completed_exams": "Completed Exams",
        "pending_essays": "Pending Essays",
        "manage_exams_title": "Manage Exams",
        "manage_exams_desc": "Add, edit, or delete exams",
        "manage_exams_btn": "Manage Exams",
        "manage_questions_title": "Manage Questions",
        "manage_questions_desc": "Add, edit, or delete questions",
        "manage_questions_btn": "Manage Questions",
        "grade_essays_title": "Grade Essays",
        "grade_essays_desc": "Review and grade essay questions",
        "grade_essays_btn": "Start Grading",
        "manage_admins_title": "Manage Admins",
        "manage_admins_desc": "Add or remove sub-admins",
        "manage_admins_btn": "Manage Admins",
        "recent_results_title": "📊 Recent Student Results",
        "th_student": "Student",
        "th_auto_score": "Auto Score",
        "th_essay_score": "Essay Score",
        "th_final_score": "Final Score",
        "th_status": "Status",
        "th_date": "Date",
        "no_results": "No results yet",
        "passed": "Passed",
        "failed": "Failed",
        "pending_grading": "⏳ Grading Pending",
        "logout_confirm": "Do you want to logout?",
        "must_be_admin": "You must login as admin",

        // Student Dashboard
        "student_dashboard_title": "Student Dashboard - Quiz System",
        "student_header_title": "🎓 Student Dashboard",
        "welcome_prefix": "Welcome",
        "info_title": "💡 Info",
        "stat_completed_exams": "Completed Exams",
        "stat_average": "Average",
        "stat_pending": "Pending Grading",
        "card_exams_title": "Exams",
        "card_exams_desc": "Browse and take available exams",
        "card_exams_btn": "View Exams",
        "card_results_title": "My Results",
        "card_results_desc": "View detailed results, final scores, and teacher feedback",
        "card_results_btn": "View Results",
        "pending_grading_msg": "You have {count} exams pending grading. You will be notified when essay grading is complete.",
        "must_login": "You must login first",

        // Register Page
        "register_title": "Register New Account - Quiz System",
        "register_header": "📝 Register New Account",
        "register_subtitle": "Join as a student or teacher",
        "teacher_tab": "Teacher",
        "full_name_label": "Full Name",
        "choose_teachers_label": "Choose Teachers (Optional)",
        "loading_teachers": "⏳ Loading teachers...",
        "teachers_helper": "💡 You can select one or more teachers, or skip this step",
        "register_student_btn": "✅ Register as Student",
        "register_teacher_btn": "👨‍🏫 Register as Teacher",
        "already_have_account": "Already have an account?",
        "login_link": "Login",
        "no_teachers": "📭 No teachers available",
        "fail_load_teachers": "❌ Failed to load teachers",
        "register_success_student": "✅ Student account registered successfully!",
        "register_success_teacher": "✅ Teacher account registered successfully!",
        "register_error": "Error during registration",
        "connection_error": "Connection error",
        "linked_with_teachers": " (Linked with {count} teachers)",

        // Manage Exams Page
        "manage_exams_page_title": "Manage Exams",
        "back_to_dashboard": "← Dashboard",
        "your_exams_title": "Your Exams",
        "add_exam_btn": "➕ Add New Exam",
        "th_exam_name": "Exam Name",
        "th_description": "Description",
        "th_duration": "Duration (min)",
        "th_passing_score": "Passing Score",
        "th_created_date": "Created Date",
        "th_actions": "Actions",
        "btn_questions": "Questions",
        "btn_edit": "Edit",
        "btn_delete": "Delete",
        "no_exams_msg": "No exams found. Start by adding one!",
        "loading": "Loading...",
        "modal_add_title": "Add Exam",
        "modal_edit_title": "Edit Exam",
        "label_exam_title": "Exam Title",
        "label_description": "Description (or Subject)",
        "label_duration": "Duration (min)",
        "label_passing_score": "Passing Score",
        "btn_cancel": "Cancel",
        "btn_save": "Save",
        "save_success": "Saved successfully",
        "error_occurred": "Error occurred",
        "confirm_delete": "Are you sure?",

        // Super Admin Dashboard (super-admin.html)
        "super_admin_dashboard_title": "Super Admin Dashboard",
        "super_admin_header": "🛡️ Super Admin Dashboard",
        "super_admin_subtitle": "Manage Teachers and Subscriptions",
        "th_number": "No.",
        "th_teacher": "Teacher",
        "th_email": "Email",
        "th_plan": "Plan",
        "th_status": "Status",
        "th_exams": "Exams",
        "btn_details": "Details",
        "loading_msg": "Loading data...",
        "confirm_delete_teacher": "Are you sure you want to delete this teacher?",

        // Manage Admins Page (manage-admins.html)
        "manage_admins_title": "Manage Admins",
        "manage_admins_header": "🛡️ Manage Admins",
        "admins_list_title": "Admins List",
        "add_admin_btn": "➕ Add New Admin",
        "th_name": "Name",
        "th_username": "Username",
        "th_password": "Password",
        "no_admins_msg": "No sub-admins found",
        "modal_add_admin_title": "Add New Admin",
        "label_full_name": "Full Name",
        "label_username": "Username",
        "label_password": "Password",
        "btn_save_admin": "💾 Save Admin",
        "admin_added_success": "✅ Admin added successfully",
        "confirm_delete_admin": "Are you sure you want to delete this admin?",
        "only_super_admin": "Sorry, this page is for Super Admin only",
        "active_status": "✅ Active",
        "inactive_status": "❌ Inactive",
        "fetch_error": "Error loading data",

        // Teacher Details (teacher-details.html)
        "teacher_details_title": "Teacher Details",
        "teacher_details_header": "👨‍🏫 Teacher Details",
        "teacher_info_card": "Teacher Information",
        "label_name": "Name:",
        "label_plan": "Plan:",
        "label_status": "Status:",
        "label_exams_count": "Exams Count:",
        "label_students_count": "Students Count:",
        "actions_card": "Actions",
        "btn_suspend": "🔒 Suspend Account",
        "btn_activate": "🔓 Activate Account",
        "btn_reset_pass": "🔑 Reset Password",
        "btn_delete_teacher": "🗑️ Delete Account",
        "recent_activity_card": "Recent Activity",
        "activity_login": "Login",
        "activity_create_exam": "Created Exam",
        "months_map": {
            "1": "January", "2": "February", "3": "March", "4": "April", "5": "May", "6": "June",
            "7": "July", "8": "August", "9": "September", "10": "October", "11": "November", "12": "December"
        },
        "confirm_suspend": "Are you sure you want to suspend this account?",
        "confirm_activate": "Are you sure you want to activate this account?",
        "confirm_reset_pass": "Are you sure you want to reset the password?",
        "pass_reset_success": "Password reset successfully. New password: ",
        "action_success": "Action completed successfully",
        "back_to_list": "← Back to List",
        "subscription_info": "Subscription Info",
        "stats": "Statistics",
        "edit_teacher_settings": "Edit Teacher Settings",
        "max_students": "Max Students",
        "max_exams": "Max Exams",
        "btn_save_changes": "💾 Save Changes",
        "btn_edit_settings": "✏️ Edit Settings",
        "missing_teacher_id": "Teacher ID missing",
        "unlimited": "Unlimited",
        "never": "Never",

        // Exams List (exams-list.html)
        "available_exams_title": "Study Plan",
        "available_exams_header": "📚 Study Plan",
        "no_exams_msg": "No subjects available",
        "exam_duration": "⏱️ Duration: ",
        "passing_score": "🎯 Passing Score: ",
        "start_exam_btn": "▶️ Enter Subject",
        "minutes": "mins",

        // Quiz (quiz.html)
        "quiz_page_title": "Quiz",
        "home_tooltip": "Back to Home",
        "welcome_user": "Welcome",
        "time_remaining": "Time Remaining:",
        "student_name_label": "Student Name:",
        "student_name_placeholder": "Enter your name",
        "submit_quiz_btn": "Finish Quiz",
        "confirm_submit_quiz": "Are you sure you want to finish the quiz?",
        "time_up_msg": "Time is up! Your answers will be submitted now.",

        // Student Results (student-results.html)
        "my_results_title": "My Results - Quiz System",
        "my_results_header": "📊 My Results",
        "final_result_title": "Final Result",
        "auto_score_label": "📝 Auto Score:",
        "essay_score_label": "✍️ Essay Score:",
        "final_score_label": "🎯 Final Score:",
        "essay_pending_msg": "📝 Essays are being graded...",
        "status_pass": "🎉 Passed",
        "status_fail": "❌ Failed",
        "teacher_feedback_title": "📝 Teacher Feedback",
        "your_score": "Your Score:",
        "pending_grading_title": "⏳ Grading in Progress",
        "pending_grading_msg": "You will be notified when grading is complete",
        "submission_date": "Submission Date:",
        "no_results_msg": "You haven't taken the quiz yet",
        "solve_exam_first": "Take the quiz first to see your results",

        // Teacher Dashboard (teacher-dashboard.html)
        "teacher_dashboard_title": "Teacher Dashboard",
        "teacher_header": "👨‍🏫 Teacher Dashboard",
        "stat_active_exams": "Active Exams",
        "stat_registered_students": "Registered Students",
        "stat_student_answers": "Student Answers",
        "stat_pending_essays": "Pending Essays",
        "action_manage_exams": "📚 Manage Exams",
        "action_manage_exams_desc": "Create and edit exams and questions",
        "action_manage_students": "👥 Manage Students",
        "action_manage_students_desc": "Add students and view results",
        "action_grade_essays": "📝 Grade Essays",
        "action_grade_essays_desc": "Review essay answers",

        // Essay Review (essay-review.html)
        "essay_review_title": "Essay Grading",
        "essay_review_header": "📝 Essay Grading",
        "nav_manage_questions": "Manage Questions",
        "stat_total_students": "Total Students",
        "stat_pending": "Pending",
        "stat_graded": "Graded",
        "filter_all": "All Students",
        "filter_pending": "Pending",
        "filter_graded": "Graded",
        "btn_refresh": "🔄 Refresh",
        "no_submissions_msg": "No submissions to grade",
        "no_submissions_desc": "No student has answered essay questions yet",
        "grade_label": "Grade:",
        "comment_label": "Comment:",
        "comment_placeholder": "Add your notes here (optional)...",
        "btn_save_grades": "💾 Save Grades",
        "badge_graded": "✅ Graded",
        "badge_pending": "⏳ Pending",
        "no_essay_questions": "No essay questions",
        "student_answer_label": "Student Answer:",
        "not_answered": "Not answered",
        "grades_saved_success": "✅ Grades saved successfully and sent to Google Sheets!",
        "grades_saved_local": "✅ Grades saved locally (Google Sheets connection issue)",
        "invalid_grade_error": "Invalid grade",

        // Manage Students (manage-students.html)
        "manage_students_title": "Manage Students",
        "manage_students_header": "👥 Manage Students",
        "btn_back_dashboard": "Back to Dashboard",
        "search_placeholder": "🔍 Search student...",
        "add_student_btn": "➕ Add New Student",
        "students_list_title": "Students List",
        "th_registration_date": "Registration Date",
        "th_completed_exams": "Completed Exams",
        "th_average_score": "Average Score",
        "no_students_msg": "No students found",
        "modal_add_student": "Add New Student",
        "modal_edit_student": "Edit Student",
        "label_email": "Email",
        "password_hint": "(Leave blank to keep old password)",
        "confirm_delete_student": "Are you sure you want to delete this student?\nAll associated results and data will be deleted.",
        "delete_success": "Deleted successfully",
        "delete_fail": "Failed to delete student"
    }
};

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('lang') || 'ar';
        this.init();
    }

    init() {
        this.applyLanguage(this.currentLang);
        this.injectToggleButton();
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
        localStorage.setItem('lang', this.currentLang);
        this.applyLanguage(this.currentLang);
    }

    applyLanguage(lang) {
        // Update html tag
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        // Update translations
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });

        // Update button text
        const btn = document.getElementById('lang-toggle-btn');
        if (btn) {
            btn.textContent = lang === 'ar' ? 'English' : 'العربية';
        }
    }

    injectToggleButton() {
        if (document.getElementById('lang-toggle-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'lang-toggle-btn';
        btn.onclick = () => this.toggleLanguage();
        btn.textContent = this.currentLang === 'ar' ? 'English' : 'العربية';

        // Common styles - Compact and pill-shaped
        // Common styles - Compact and pill-shaped
        const baseStyle = `
            padding: 4px 12px;
            border: 1px solid #667eea;
            border-radius: 20px;
            cursor: pointer;
            font-family: inherit;
            font-weight: 600;
            font-size: 13px;
            color: #667eea;
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: all 0.2s;
            line-height: normal;
            height: fit-content;
            width: auto;
            flex-shrink: 0;
            flex-grow: 0;
            white-space: nowrap;
        `;

        // Check for logout button
        const logoutBtn = document.querySelector('.logout-btn') || document.querySelector('.logout');

        if (logoutBtn && logoutBtn.parentNode) {
            // Create a wrapper to keep buttons together
            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
            `;

            // Insert wrapper where logout button is
            logoutBtn.parentNode.insertBefore(wrapper, logoutBtn);

            // Move logout button into wrapper
            wrapper.appendChild(logoutBtn);

            // Insert lang button before logout button
            wrapper.insertBefore(btn, logoutBtn);

            // Ensure proper spacing/alignment for the button itself
            btn.style.cssText = baseStyle + `
                margin: 0;
            `;
        } else {
            // Fallback for pages without logout (Login/Register)
            // Fixed position top-left
            btn.style.cssText = baseStyle + `
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 1001;
            `;
            document.body.appendChild(btn);
        }
    }

    // Helper to get translation programmatically
    get(key) {
        return translations[this.currentLang][key] || key;
    }
}

// Initialize
const langManager = new LanguageManager();

// Expose for dynamic scripts
window.t = (key) => langManager.get(key);
