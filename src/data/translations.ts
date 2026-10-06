export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    appName: 'VYRO',
    appTagline: 'اتصال أسرع، خصوصية أقوى',
    appSubtext: 'اتصالك. خصوصيتك. تحكمك.',
    
    // Status
    disconnected: 'غير متصل',
    connecting: 'جاري الاتصال الآمن...',
    connected: 'متصل ومحمي',
    disconnecting: 'جاري قطع الاتصال...',
    reconnecting: 'جاري إعادة الاتصال التلقائي...',
    
    // Actions
    connect: 'اتصال',
    disconnect: 'فصل',
    cancel: 'إلغاء',
    changeServer: 'تغيير الخادم',
    quickConnect: 'اتصال سريع',
    testSpeed: 'اختبار السرعة',
    runDiagnostics: 'فحص الشبكة',
    refresh: 'تحديث',
    save: 'حفظ',
    close: 'إغلاق',
    copy: 'نسخ',
    copied: 'تم النسخ!',
    searchServers: 'ابحث عن دولة، مدينة، أو ميزة...',
    
    // Stats & Metrics
    duration: 'مدة الاتصال',
    downloadSpeed: 'سرعة التحميل',
    uploadSpeed: 'سرعة الرفع',
    totalDownloaded: 'إجمالي التحميل',
    totalUploaded: 'إجمالي الرفع',
    ping: 'الاستجابة (Ping)',
    jitter: 'تذبذب الإشارة',
    packetLoss: 'فقدان الحزم',
    currentIp: 'عنوان الـ IP الافتراضي',
    realIp: 'عنوانك الحقيقي المكشوف',
    isp: 'مزود الخدمة',
    location: 'الموقع الجغرافي',
    protocol: 'بروتوكول التشفير',
    encryption: 'خوارزمية التشفير',
    serverLoad: 'ضغط الخادم',
    
    // Tabs & Navigation
    tabHome: 'الرئيسية',
    tabServers: 'الخوادم',
    tabPrivacy: 'درع الخصوصية',
    tabSpeed: 'فحص السرعة',
    tabWifi: 'أمان الـ Wi-Fi',
    tabLogs: 'سجل الاتصال',
    tabSettings: 'الإعدادات',

    // Features Section
    feature1Title: 'اتصال آمن ومشفّر 🔐',
    feature1Desc: 'تشفير فائق من الدرجة العسكرية (ChaCha20 / AES-256) لحماية بياناتك من المتلصصين.',
    feature2Title: 'خوادم VPN عالمية 🌍',
    feature2Desc: 'خوادم عالية السرعة بـ 10 جيجابت موزعة في كبرى العواصم للوصول الحر للمحتوى.',
    feature3Title: 'أداء واتصال مستقر ⚡',
    feature3Desc: 'هندسة شبكة متطورة تمنع تقطيع الاتصال وتوفر ثباتاً استثنائياً أثناء اللعب والمشاهدة.',
    feature4Title: 'حماية الخصوصية ومنع التسريب 🛡️',
    feature4Desc: 'حماية كاملة من تسريب الـ DNS و WebRTC مع سياسة صارمة لعدم حفظ السجلات.',
    feature5Title: 'إعادة الاتصال تلقائيًا 🔄',
    feature5Desc: 'استعادة فورية للاتصال عند انقطاع الشبكة دون الحاجة لتدخلك اليدوي.',
    feature6Title: 'حماية شبكات Wi-Fi العامة 🔒',
    feature6Desc: 'درع أمني تلقائي ينشط فور الاتصال بشبكات المقاهي والفنادق والمطارات غير الموثوقة.',

    // Categories
    catAll: 'الكل',
    catFastest: 'الأسرع (موصى به)',
    catGaming: 'الألعاب والـ Ping المنخفض',
    catStreaming: 'البث والترفيه 4K',
    catPrivacy: 'الخصوصية القصوى (Double Hop)',
    catP2p: 'تنزيل P2P السريع',

    // Wi-Fi Module
    wifiTitle: 'فاحص أمان شبكة Wi-Fi',
    wifiSafe: 'الشبكة محمية عبر VPN',
    wifiUnsafe: 'تحذير: شبكة عامة غير مشفرة!',
    wifiCurrentNetwork: 'الشبكة الحالية',
    wifiSecurityType: 'نوع الحماية',
    wifiAutoProtect: 'حماية تلقائية عند الاتصال بشبكات غير معروفة',
    wifiThreatScan: 'فحص التهديدات وهجمات Man-in-the-Middle',
    wifiNoThreats: 'لا توجد تهديدات، نفق VPN يشفّر جميع الحزم 100%.',

    // Privacy & Leak Protection
    privacyShieldTitle: 'مركز أمان وخصوصية البيانات',
    dnsLeakStatus: 'فحص تسريب DNS',
    dnsProtected: 'محمي 100% (استعلامات DNS مشفرة عبر VYRO)',
    ipMaskingStatus: 'حجب الهوية الحقيقية',
    ipMasked: 'مخفي تماماً خلف نفق مشفر',
    killSwitchTitle: 'مفتاح القفل التلقائي (Kill Switch)',
    killSwitchDesc: 'قطع الإنترنت فوراً إذا توقف الـ VPN لمنع أي تسريب لعنوانك الحقيقي.',
    trackerBlocker: 'مانع الإعلانات والمتعقبات (VYRO Shield)',
    trackersBlockedCount: 'إعلان ومتعقب تم حجبهم اليوم',
    
    // Settings
    settingsTitle: 'إعدادات الاتصال والشبكة',
    protocolSelection: 'بروتوكول الاتصال',
    autoConnectOnStart: 'الاتصال التلقائي عند بدء التشغيل',
    autoReconnectLabel: 'إعادة الاتصال التلقائي عند انقطاع الشبكة',
    splitTunnelingTitle: 'التقسيم النفقي (Split Tunneling)',
    splitTunnelingDesc: 'اختر التطبيقات والمواقع التي تتصل مباشرة بالإنترنت دون المرور عبر VPN.',
    customDnsTitle: 'خادم DNS مخصص',
    soundEffectsLabel: 'المؤثرات الصوتية التفاعلية',
    hapticFeedbackLabel: 'الاستجابة الاهتزازية',
    themeLabel: 'مظهر التطبيق',
    exportFilesTitle: 'حفظ وتحميل ملفات المشروع كاملة (ZIP)',
    exportFilesDesc: 'تحميل حزمة الكود المصدري والمجلدات بالكامل بصيغة ZIP مضغوطة وجاهزة للتشغيل الفوري محلياً.',
    downloadZipBtn: 'تحميل كامل الملفات (ZIP)',
    downloadZipSuccess: 'تم بدء تحميل أرشيف المشروع بنجاح!',
    
    // Logs
    connectionLogsTitle: 'سجل التشخيص والأحداث المباشرة',
    liveLogs: 'البث المباشر للأحداث',
    clearLogs: 'مسح السجل',
    
    // Speed Test
    speedTestTitle: 'فاحص سرعة واستقرار الاتصال',
    startSpeedTest: 'بدء الفحص الآن',
    testingDownload: 'جاري قياس سرعة التحميل...',
    testingUpload: 'جاري قياس سرعة الرفع...',
    testingPing: 'جاري قياس الاستجابة والـ Jitter...',
    speedTestComplete: 'اكتمل الفحص بنجاح!',
    speedExcellent: 'ممتاز جداً لألعاب الأونلاين والبث بدقة 4K HDR',
    
    // Dialogs & Notifications
    connectedSuccessToast: 'تم الاتصال بنجاح بخادم',
    disconnectedToast: 'تم فصل اتصال الـ VPN بأمان',
    wifiProtectedToast: 'تم تفعيل درع الأمان التلقائي لشبكة Wi-Fi',
    
    // Footer & Info
    noLogsPolicy: 'سياسة صارمة: بدون سجلات تصفح (Zero-Log Policy)',
    quantumReadyBadge: 'تشفير كمومي Post-Quantum KEM جاهز',
    version: 'الإصدار 2.5.4 Pro'
  },
  en: {
    appName: 'VYRO',
    appTagline: 'Faster Connection, Stronger Privacy',
    appSubtext: 'Your Connection. Your Privacy. Your Control.',
    
    // Status
    disconnected: 'Disconnected',
    connecting: 'Establishing Secure Tunnel...',
    connected: 'Connected & Shielded',
    disconnecting: 'Disconnecting...',
    reconnecting: 'Auto-Reconnecting...',
    
    // Actions
    connect: 'Connect',
    disconnect: 'Disconnect',
    cancel: 'Cancel',
    changeServer: 'Change Server',
    quickConnect: 'Quick Connect',
    testSpeed: 'Speed Test',
    runDiagnostics: 'Run Diagnostics',
    refresh: 'Refresh',
    save: 'Save',
    close: 'Close',
    copy: 'Copy',
    copied: 'Copied!',
    searchServers: 'Search country, city, or tag...',
    
    // Stats & Metrics
    duration: 'Connection Time',
    downloadSpeed: 'Download Speed',
    uploadSpeed: 'Upload Speed',
    totalDownloaded: 'Total Downloaded',
    totalUploaded: 'Total Uploaded',
    ping: 'Latency (Ping)',
    jitter: 'Jitter',
    packetLoss: 'Packet Loss',
    currentIp: 'Virtual Masked IP',
    realIp: 'Real Exposed IP',
    isp: 'ISP Provider',
    location: 'Virtual Location',
    protocol: 'VPN Protocol',
    encryption: 'Encryption Cipher',
    serverLoad: 'Server Load',
    
    // Tabs & Navigation
    tabHome: 'Home',
    tabServers: 'Servers',
    tabPrivacy: 'Privacy Shield',
    tabSpeed: 'Speed Test',
    tabWifi: 'Wi-Fi Guard',
    tabLogs: 'Logs',
    tabSettings: 'Settings',

    // Features Section
    feature1Title: 'Secure & Encrypted Connection 🔐',
    feature1Desc: 'Military-grade ChaCha20/AES-256 cipher protects your traffic from prying eyes.',
    feature2Title: 'Global VPN Server Network 🌍',
    feature2Desc: 'Ultra-fast 10 Gbps RAM-only servers in major hubs worldwide for unrestricted browsing.',
    feature3Title: 'Stable High Performance ⚡',
    feature3Desc: 'Engineered for seamless stability, zero drops, and ultra-low gaming latency.',
    feature4Title: 'Privacy & Leak Protection 🛡️',
    feature4Desc: 'Zero-log architecture with total DNS, IPv6, and WebRTC leak insulation.',
    feature5Title: 'Instant Auto-Reconnect 🔄',
    feature5Desc: 'Self-healing connection resumes instantaneously if network drops occur.',
    feature6Title: 'Public Wi-Fi Shield 🔒',
    feature6Desc: 'Proactive defense automatically guards you on hotel, airport, and cafe networks.',

    // Categories
    catAll: 'All Locations',
    catFastest: 'Fastest (Recommended)',
    catGaming: 'Gaming & Low Ping',
    catStreaming: 'Streaming & 4K',
    catPrivacy: 'Maximum Privacy (Double Hop)',
    catP2p: 'P2P & Fast Downloads',

    // Wi-Fi Module
    wifiTitle: 'Wi-Fi Network Security Auditor',
    wifiSafe: 'Network is Shielded with VPN',
    wifiUnsafe: 'Warning: Public Unencrypted Wi-Fi!',
    wifiCurrentNetwork: 'Current SSID',
    wifiSecurityType: 'Encryption Type',
    wifiAutoProtect: 'Auto-enable VPN on untrusted Wi-Fi hotspots',
    wifiThreatScan: 'Threat & Man-in-the-Middle Auditor',
    wifiNoThreats: 'No threats detected. 100% of packets encapsulated in encrypted tunnel.',

    // Privacy & Leak Protection
    privacyShieldTitle: 'Data Privacy & Security Center',
    dnsLeakStatus: 'DNS Leak Test',
    dnsProtected: '100% Protected (Encrypted DNS via VYRO Zero-Log resolvers)',
    ipMaskingStatus: 'Real Identity Masking',
    ipMasked: 'Completely concealed behind encrypted gateway',
    killSwitchTitle: 'Automatic Kill Switch',
    killSwitchDesc: 'Instantly block all network traffic if VPN connection unexpectedly drops.',
    trackerBlocker: 'VYRO Shield Ad & Tracker Blocker',
    trackersBlockedCount: 'Ads and trackers blocked today',
    
    // Settings
    settingsTitle: 'Connection & Network Preferences',
    protocolSelection: 'Protocol Mode',
    autoConnectOnStart: 'Auto-connect when app launches',
    autoReconnectLabel: 'Auto-reconnect on network interruptions',
    splitTunnelingTitle: 'Split Tunneling',
    splitTunnelingDesc: 'Choose which apps or websites bypass the VPN tunnel directly.',
    customDnsTitle: 'Custom DNS Resolver',
    soundEffectsLabel: 'Tactile Audio Feedback',
    hapticFeedbackLabel: 'Haptic Vibrations',
    themeLabel: 'Visual Atmosphere',
    exportFilesTitle: 'Save & Export Complete Project Files (ZIP)',
    exportFilesDesc: 'Download the entire source code archive and directory structure ready for local development.',
    downloadZipBtn: 'Download Full Project ZIP',
    downloadZipSuccess: 'Project archive download initiated!',
    
    // Logs
    connectionLogsTitle: 'Diagnostic & Connection Event Log',
    liveLogs: 'Real-time Event Stream',
    clearLogs: 'Clear Logs',
    
    // Speed Test
    speedTestTitle: 'Connection Benchmark & Latency Test',
    startSpeedTest: 'Run Benchmark Now',
    testingDownload: 'Benchmarking Download Throughput...',
    testingUpload: 'Benchmarking Upload Throughput...',
    testingPing: 'Measuring Ping & Jitter stability...',
    speedTestComplete: 'Benchmark Complete!',
    speedExcellent: 'Ultra-fast tier! Perfect for competitive multiplayer and 4K HDR streaming.',
    
    // Dialogs & Notifications
    connectedSuccessToast: 'Successfully connected to server',
    disconnectedToast: 'VPN connection safely terminated',
    wifiProtectedToast: 'Wi-Fi Auto-Shield activated',
    
    // Footer & Info
    noLogsPolicy: 'Strict Zero-Log Policy Verified by Independent Audit',
    quantumReadyBadge: 'Post-Quantum KEM Encryption Ready',
    version: 'Version 2.5.4 Pro'
  }
};
