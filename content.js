(function () {
  const CONTENT = {
    en: {
      meta: {
        title: 'Mailing Academy',
        subtitle: 'Learn email deliverability step-by-step',
      },
      home: {
        headline: 'Your Email Journey, Visualized',
        intro:
          'Pro level mode: explore the full delivery pipeline. Click the MTA to “explode” internal queues and logic. Open DNS and filtering deep dives, then use Back/Forward like real pages.',
        simTitle: 'Interactive Journey Simulation',
        simSubtitle: 'Click the MTA to expand. Click nodes to deep-dive.',
        modulesTitle: 'Modules',
        modulesSubtitle: 'Choose a technical lesson',
      },
      footer: {
        tagline: 'Deliverability made practical — from RFCs to inbox.',
        quick: 'Quick Links',
        contact: 'Stay Connected',
        contactText: 'Add your links here.',
      },
      ui: {
        back: 'Back',
        close: 'Close',
        backToMap: 'Back to Map',
        deepDive: 'Deep Dive',
      },
      labels: {
        mta: 'MTA',
        dns: 'DNS',
        filter: 'Filter',
        inbox: 'Inbox',
        spam: 'Spam',
      },
      deepDives: {
        dns: {
          level: 'Deep Dive',
          title: 'DNS Handshake: SPF + DKIM + DMARC',
          bodyHtml:
            '<p>Mailbox providers validate identity by querying DNS and comparing results with what they observe in the SMTP session and message headers.</p>' +
            '<div class="diagram">' +
            '<div class="diagram-title">Step-by-step handshake</div>' +
            '<span class="chip">1) SMTP connects</span>' +
            '<span class="chip">2) Extract RFC5322.From</span>' +
            '<span class="chip">3) SPF TXT lookup</span>' +
            '<span class="chip">4) DKIM key lookup</span>' +
            '<span class="chip">5) DMARC policy lookup</span>' +
            '</div>' +
            '<svg class="deep-svg" viewBox="0 0 980 310" role="img" aria-label="DNS authentication handshake diagram">' +
            '<defs>' +
            '<marker id="authArrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
            '<path d="M0 0 L10 5 L0 10 z" fill="#fb923c"/>' +
            '</marker>' +
            '</defs>' +
            '<rect x="30" y="48" width="260" height="88" rx="16" fill="rgba(2,6,23,0.35)" stroke="rgba(148,163,184,0.22)" />' +
            '<text x="160" y="86" text-anchor="middle" fill="rgba(226,232,240,0.92)" font-size="15" font-weight="800">Receiver / MX</text>' +
            '<text x="160" y="112" text-anchor="middle" fill="rgba(226,232,240,0.65)" font-size="12">observes IP + MAIL FROM + headers</text>' +
            '<rect x="360" y="48" width="260" height="88" rx="16" fill="rgba(2,6,23,0.35)" stroke="rgba(148,163,184,0.22)" />' +
            '<text x="490" y="86" text-anchor="middle" fill="rgba(226,232,240,0.92)" font-size="15" font-weight="800">DNS Resolver</text>' +
            '<text x="490" y="112" text-anchor="middle" fill="rgba(226,232,240,0.65)" font-size="12">caching + recursion</text>' +
            '<rect x="690" y="48" width="260" height="88" rx="16" fill="rgba(2,6,23,0.35)" stroke="rgba(148,163,184,0.22)" />' +
            '<text x="820" y="80" text-anchor="middle" fill="rgba(226,232,240,0.92)" font-size="15" font-weight="800">Authoritative DNS</text>' +
            '<text x="820" y="106" text-anchor="middle" fill="rgba(226,232,240,0.65)" font-size="12">example.com zone</text>' +
            '<path d="M290 92 H 360" stroke="#60a5fa" stroke-width="3" marker-end="url(#authArrow)" />' +
            '<path d="M620 92 H 690" stroke="#60a5fa" stroke-width="3" marker-end="url(#authArrow)" />' +
            '<path d="M690 140 H 620" stroke="rgba(251,146,60,0.85)" stroke-width="3" marker-end="url(#authArrow)" />' +
            '<path d="M360 140 H 290" stroke="rgba(251,146,60,0.85)" stroke-width="3" marker-end="url(#authArrow)" />' +
            '<text x="326" y="78" text-anchor="middle" fill="rgba(226,232,240,0.70)" font-size="12">TXT?</text>' +
            '<text x="656" y="78" text-anchor="middle" fill="rgba(226,232,240,0.70)" font-size="12">lookup</text>' +
            '<text x="656" y="164" text-anchor="middle" fill="rgba(226,232,240,0.70)" font-size="12">answers</text>' +
            '<text x="326" y="164" text-anchor="middle" fill="rgba(226,232,240,0.70)" font-size="12">evaluate</text>' +
            '<rect x="30" y="190" width="920" height="88" rx="18" fill="rgba(15,23,42,0.55)" stroke="rgba(148,163,184,0.18)" />' +
            '<text x="60" y="224" fill="rgba(251,146,60,0.92)" font-size="13" font-weight="900">Typical records</text>' +
            '<text x="60" y="250" fill="rgba(226,232,240,0.72)" font-size="12">SPF:</text>' +
            '<text x="112" y="250" fill="rgba(226,232,240,0.9)" font-size="12">v=spf1 ip4:203.0.113.0/24 include:spf.esp.com -all</text>' +
            '<text x="60" y="272" fill="rgba(226,232,240,0.72)" font-size="12">DKIM:</text>' +
            '<text x="118" y="272" fill="rgba(226,232,240,0.9)" font-size="12">selector._domainkey.example.com TXT "p=BASE64…"</text>' +
            '</svg>' +
            '<h3>SPF (envelope / RFC5321)</h3>' +
            '<ul><li>Inputs: connecting IP + <code>MAIL FROM</code> (or HELO if null sender).</li><li>Output: pass/fail/softfail/neutral/temperror.</li><li>Common pitfall: too many DNS lookups (10 limit).</li></ul>' +
            '<h3>DKIM (header signature)</h3>' +
            '<ul><li>Inputs: <code>DKIM-Signature</code> header + body hash.</li><li>Receiver fetches public key from <code>selector._domainkey</code>.</li><li>Failure modes: canonicalization mismatch, key rotation mistakes, body modified by intermediaries.</li></ul>' +
            '<h3>DMARC (alignment + policy)</h3>' +
            '<ul><li>Requires alignment between RFC5322.From and SPF/DKIM identifiers.</li><li>Policy example: <code>v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com</code></li></ul>',
        },
        filter: {
          level: 'Deep Dive',
          title: 'Filtering: What actually happens',
          bodyHtml:
            '<p>Filtering is a pipeline: authentication, reputation, content analysis, and user feedback signals. Providers maintain multiple models and rulesets and blend them.</p>' +
            '<div class="diagram">' +
            '<div class="diagram-title">Common scoring signals</div>' +
            '<span class="chip">Auth pass rate</span>' +
            '<span class="chip">Domain reputation</span>' +
            '<span class="chip">IP reputation</span>' +
            '<span class="chip">Complaint rate</span>' +
            '<span class="chip">Hard bounce rate</span>' +
            '<span class="chip">Engagement</span>' +
            '</div>' +
            '<h3>Operational takeaway</h3>' +
            '<ul><li>Don’t “optimize” content without fixing list quality.</li><li>Monitor complaints per mailbox provider.</li><li>Keep sending patterns consistent.</li></ul>',
        },
        inbox: {
          level: 'Deep Dive',
          title: 'Inbox placement: Keeping it stable',
          bodyHtml:
            '<p>Inbox is not a permanent state — it is maintained by consistent identity signals and predictable behavior.</p>' +
            '<ul><li>Ensure SPF/DKIM pass + DMARC alignment.</li><li>Prefer dedicated or well-managed shared IP pools.</li><li>Throttle and retry with backoff on 4xx responses.</li></ul>',
        },
        spam: {
          level: 'Deep Dive',
          title: 'Spam + Feedback loop mechanics',
          bodyHtml:
            '<p>Spam placement increases negative feedback (complaints), which lowers reputation. Some providers expose complaint feedback loops (FBL).</p>' +
            '<h3>Reduce spam placement</h3>' +
            '<ul><li>Fix acquisition: permission, double opt-in, remove stale lists.</li><li>Lower complaint rate: better targeting, frequency capping, clear unsubscribe.</li><li>Authenticate and align identity (DMARC).</li></ul>',
        },
        'mta-input': {
          level: 'Deep Dive',
          title: 'Inside the MTA: Input Queue',
          bodyHtml:
            '<p>The input queue is where accepted messages wait before processing. Real MTAs isolate acceptance from delivery so the SMTP listener stays fast.</p>' +
            '<h3>What happens here</h3>' +
            '<ul><li>Spooling to disk (durable storage).</li><li>Basic sanity checks + policy gates.</li><li>Enqueue by domain / tenant / campaign.</li></ul>' +
            '<h3>Postfix mental model</h3>' +
            '<ul><li><code>smtpd</code> accepts mail → <code>cleanup</code> normalizes → <code>qmgr</code> schedules deliveries.</li></ul>',
        },
        'mta-engine': {
          level: 'Deep Dive',
          title: 'Inside the MTA: Processing Engine',
          bodyHtml:
            '<p>This is the “business logic” layer: policy evaluation, signing, routing, throttling, and per-domain behaviors.</p>' +
            '<div class="diagram">' +
            '<div class="diagram-title">Typical engine stages</div>' +
            '<span class="chip">Policy</span>' +
            '<span class="chip">Rewrite</span>' +
            '<span class="chip">DKIM Sign</span>' +
            '<span class="chip">Routing</span>' +
            '<span class="chip">Throttling</span>' +
            '</div>' +
            '<h3>PowerMTA / high-volume notes</h3>' +
            '<ul><li>Use per-domain concurrency limits and adaptive backoff.</li><li>Separate tenants with virtual MTAs (vMTAs).</li><li>Log DSNs and classify failures (hard vs transient).</li></ul>',
        },
        'mta-rotate': {
          level: 'Deep Dive',
          title: 'Inside the MTA: IP Rotation Logic',
          bodyHtml:
            '<p>IP rotation is not random. It should preserve reputation and avoid sudden pattern changes.</p>' +
            '<h3>Good rotation strategies</h3>' +
            '<ul><li>Rotate by recipient domain (Gmail/Outlook/Yahoo) to isolate reputation signals.</li><li>Warm up each IP with a controlled daily ramp.</li><li>Maintain consistent HELO/EHLO identity and reverse DNS (PTR).</li></ul>' +
            '<h3>Anti-patterns</h3>' +
            '<ul><li>Rotating to “escape” blocks.</li><li>Mixing cold and warm IPs in the same pool.</li></ul>',
        },
        'mta-out': {
          level: 'Deep Dive',
          title: 'Inside the MTA: Outbound Queue',
          bodyHtml:
            '<p>The outbound queue feeds delivery workers and manages retries. Correct retry policy is critical to reputation.</p>' +
            '<h3>Key behaviors</h3>' +
            '<ul><li>Retry transient failures (4xx) with exponential backoff.</li><li>Stop retrying after an expiry window (e.g., 2–5 days depending on use case).</li><li>Apply per-domain rate limits and connection reuse.</li></ul>',
        },
      },
      lessons: {
        basics: {
          level: 'Level 1',
          title: 'Email Anatomy (Real Structure)',
          description: 'A real message: headers vs body vs footer, and what MTAs sign and inspect.',
          bodyHtml:
            '<p>Think of an email as two layers:</p>' +
            '<ul><li><strong>Envelope</strong> (SMTP): <code>MAIL FROM</code> + <code>RCPT TO</code> — used for routing and SPF.</li><li><strong>Content</strong> (RFC5322): headers + body — used for DKIM, filtering, and display.</li></ul>' +
            '<div class="diagram">' +
            '<div class="diagram-title">Example: minimal raw message</div>' +
            '<pre style="white-space:pre-wrap; margin:0; color:rgba(226,232,240,0.9); font-size:12px; line-height:1.55;">' +
            'From: "Brand" &lt;news@example.com&gt;\n' +
            'To: user@gmail.com\n' +
            'Subject: Welcome\n' +
            'Date: Tue, 11 Feb 2026 18:00:00 +0100\n' +
            'Message-ID: &lt;abc123@example.com&gt;\n' +
            'MIME-Version: 1.0\n' +
            'Content-Type: multipart/alternative; boundary="b1"\n' +
            '\n' +
            '--b1\n' +
            'Content-Type: text/plain; charset=utf-8\n\n' +
            'Hello!\n\n' +
            '--b1\n' +
            'Content-Type: text/html; charset=utf-8\n\n' +
            '&lt;html&gt;...&lt;/html&gt;\n' +
            '--b1--\n' +
            '</pre>' +
            '</div>' +
            '<h3>Header vs Body vs Footer</h3>' +
            '<ul><li><strong>Headers</strong>: routing metadata, authentication results, and MIME.</li><li><strong>Body</strong>: the content part(s) (HTML/plain).</li><li><strong>Footer</strong>: usually part of the body (unsubscribe, address); critical for compliance.</li></ul>' +
            '<h3>Practical</h3>' +
            '<ul><li>Always include a plain-text alternative.</li><li>Keep HTML clean (no broken tags) and avoid aggressive tracking patterns.</li><li>For bulk mail: include a clear unsubscribe and physical address.</li></ul>',
        },
        auth: {
          level: 'Level 2',
          title: 'Authentication Deep Technical: SPF/DKIM/DMARC',
          description: 'Records, alignment, evaluation, and common failure modes.',
          bodyHtml:
            '<p>Authentication is not a single check — it’s multiple checks and then <em>alignment</em>.</p>' +
            '<div class="diagram">' +
            '<div class="diagram-title">How evaluation typically flows</div>' +
            '<span class="chip">Observe IP</span>' +
            '<span class="chip">SPF result</span>' +
            '<span class="chip">DKIM verify</span>' +
            '<span class="chip">DMARC align</span>' +
            '<span class="chip">Policy action</span>' +
            '</div>' +
            '<h3>SPF details</h3>' +
            '<ul><li>Publish a single authoritative SPF TXT per domain.</li><li>Prefer <code>-all</code> for strict domains once stable.</li><li>Watch the 10 DNS-lookup limit; flattening may help.</li></ul>' +
            '<h3>DKIM details</h3>' +
            '<ul><li>Use 2048-bit keys where supported.</li><li>Rotate selectors safely: publish new key, start signing, then retire old.</li><li>Sign stable headers (From, Subject, Date) and ensure body canonicalization matches your pipeline.</li></ul>' +
            '<h3>DMARC details</h3>' +
            '<ul><li>Start with <code>p=none</code> + reporting, then move to <code>quarantine</code> and <code>reject</code>.</li><li>Use <code>adkim=s</code>/<code>aspf=s</code> (strict) only when you fully control subdomains.</li></ul>' +
            '<p><strong>Tip:</strong> Open the DNS deep dive on the map for a visual handshake.</p>',
        },
        mta: {
          level: 'Level 3',
          title: 'MTA Engineering: Postfix / PowerMTA + Warm-up',
          description: 'Queues, throttling, retries, IP rotation, and warm-up strategy.',
          bodyHtml:
            '<p>An MTA (Mail Transfer Agent) is a delivery engine. It needs strict retry logic and per-domain shaping to protect reputation.</p>' +
            '<h3>Postfix: practical knobs</h3>' +
            '<ul>' +
            '<li><code>default_process_limit</code>, <code>smtpd_client_connection_count_limit</code> — concurrency control</li>' +
            '<li><code>smtp_destination_concurrency_limit</code> — per-domain concurrency</li>' +
            '<li><code>smtp_connection_cache_on_demand</code> — connection reuse</li>' +
            '<li><code>maximal_queue_lifetime</code> — retry expiry window</li>' +
            '</ul>' +
            '<h3>PowerMTA (high volume)</h3>' +
            '<ul>' +
            '<li>Use vMTAs and per-domain rules.</li>' +
            '<li>Classify responses; throttle on 4xx and adapt rate.</li>' +
            '<li>Centralize bounce processing and complaint ingestion.</li>' +
            '</ul>' +
            '<div class="diagram">' +
            '<div class="diagram-title">Warm-up strategy (concept)</div>' +
            '<span class="chip">Day 1: low volume</span>' +
            '<span class="chip">Day 3: +50%</span>' +
            '<span class="chip">Day 7: stable ramps</span>' +
            '<span class="chip">Only engaged users</span>' +
            '</div>' +
            '<h3>Warm-up rules that actually work</h3>' +
            '<ul><li>Send to your most engaged recipients first.</li><li>Increase volume gradually and consistently.</li><li>Separate transactional vs promotional streams.</li><li>Stop ramping when complaints or bounces rise.</li></ul>' +
            '<p><strong>Tip:</strong> Click the MTA on the map and explore internal components.</p>',
        },
        deliverability: {
          level: 'Level 2',
          title: 'Deliverability & Reputation',
          description: 'How providers decide inbox vs spam at scale.',
          bodyHtml:
            '<p>Deliverability is mainly reputation + authentication + engagement — and consistency.</p>' +
            '<h3>Key metrics</h3>' +
            '<ul><li>Complaint rate</li><li>Hard bounce rate</li><li>Unknown user rate</li><li>Engagement (opens/clicks/replies)</li></ul>' +
            '<h3>Engineering actions</h3>' +
            '<ul><li>Separate traffic classes (transactional/promotional).</li><li>Throttle per recipient domain and respect 4xx.</li><li>Implement list hygiene and sunset policies.</li></ul>',
        },
        content: {
          level: 'Level 2',
          title: 'Content & Spam Triggers (Modern)',
          description: 'Content is a multiplier, not the root cause — but it can break you.',
          bodyHtml:
            '<p>Most inboxing failures are list/reputation problems. Content still matters because it amplifies risk.</p>' +
            '<h3>High-risk patterns</h3>' +
            '<ul><li>Misleading subject/body mismatch</li><li>Link/domain mismatch</li><li>Image-only emails</li><li>Broken HTML or tracking overload</li></ul>' +
            '<h3>Best practice</h3>' +
            '<ul><li>Use consistent branding + domains.</li><li>Keep HTML simple and test rendering.</li><li>Match promise and payload.</li></ul>',
        },
        troubleshooting: {
          level: 'Level 3',
          title: 'Troubleshooting Inboxing',
          description: 'A technical checklist when placement drops.',
          bodyHtml:
            '<h3>Immediate checks</h3>' +
            '<ul><li>SPF pass? DKIM pass? DMARC alignment?</li><li>Domain/IP reputation dashboards (where available).</li><li>Complaint rate changes by provider.</li><li>Sudden volume changes or list source changes.</li></ul>' +
            '<h3>Header forensics</h3>' +
            '<ul><li>Look for <code>Authentication-Results</code> and ARC chains.</li><li>Verify DKIM selector and signed headers.</li><li>Compare RFC5322.From vs envelope sender.</li></ul>',
        },
      },
      legal: {
        privacy: {
          title: 'Privacy Policy',
          bodyHtml:
            '<p><strong>Effective Date:</strong> 2026-02-11</p>' +
            '<p>This Privacy Policy explains how this site/app (“<strong>Mailing Academy</strong>”, “we”, “us”) handles information when you use our content.</p>' +
            '<h3>1) Information We Collect</h3>' +
            '<ul><li><strong>Personal information:</strong> We do not intentionally collect personal information through this static educational app unless you provide it via external links or embedded services.</li>' +
            '<li><strong>Usage data:</strong> If analytics or logging are added (e.g., via the host platform), they may collect device/browser and usage metrics.</li></ul>' +
            '<h3>2) How We Use Information</h3>' +
            '<ul><li>To operate and improve the educational experience.</li><li>To maintain security and prevent abuse.</li></ul>' +
            '<h3>3) Cookies and Tracking</h3>' +
            '<p>This app itself does not set cookies. If embedded third-party services are used (fonts, analytics, video), those providers may set cookies under their own policies.</p>' +
            '<h3>4) Third-Party Links</h3>' +
            '<p>We may link to third-party resources. We are not responsible for their privacy practices.</p>' +
            '<h3>5) Data Retention</h3>' +
            '<p>If we collect data via integrated services, we retain it only as long as needed for the purposes described, unless a longer period is required by law.</p>' +
            '<h3>6) Your Rights</h3>' +
            '<p>Depending on your jurisdiction, you may have rights to access, delete, or correct personal data. Contact us using your published support channel.</p>' +
            '<h3>7) Changes</h3>' +
            '<p>We may update this policy. Continued use after changes means you accept the updated policy.</p>',
        },
        terms: {
          title: 'Terms of Service',
          bodyHtml:
            '<p><strong>Effective Date:</strong> 2026-02-11</p>' +
            '<p>By accessing or using Mailing Academy, you agree to these Terms.</p>' +
            '<h3>1) Educational Use</h3>' +
            '<p>The content is provided for educational purposes only and does not constitute professional advice.</p>' +
            '<h3>2) Acceptable Use</h3>' +
            '<ul><li>You may not use the site to violate laws, send spam, or perform abusive behavior.</li><li>You may not attempt to disrupt the site or reverse engineer hosted components.</li></ul>' +
            '<h3>3) Intellectual Property</h3>' +
            '<p>All content, design, and materials are owned by us or licensed to us unless stated otherwise.</p>' +
            '<h3>4) No Warranty</h3>' +
            '<p>The service is provided “as is” without warranties of any kind, express or implied.</p>' +
            '<h3>5) Limitation of Liability</h3>' +
            '<p>To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of the service.</p>' +
            '<h3>6) Changes and Termination</h3>' +
            '<p>We may update the service or these Terms at any time. We may suspend access if misuse is detected.</p>',
        },
        disclaimer: {
          title: 'Disclaimer',
          bodyHtml:
            '<p>The information presented in Mailing Academy is for general educational purposes.</p>' +
            '<ul>' +
            '<li><strong>No legal advice:</strong> Nothing here is legal advice.</li>' +
            '<li><strong>No deliverability guarantees:</strong> Inbox placement depends on many factors outside our control.</li>' +
            '<li><strong>External resources:</strong> We may link to third-party resources; we do not endorse or guarantee them.</li>' +
            '</ul>' +
            '<p>Use the content at your own risk.</p>',
        },
      },
    },

    ar: {
      meta: {
        title: 'أكاديمية الإيميل',
        subtitle: 'تعلّم التسليم خطوة بخطوة',
      },
      home: {
        headline: 'رحلة البريد الإلكتروني (مستوى احترافي)',
        intro:
          'وضع Pro: استكشف خط التسليم بالكامل. اضغط على الـ MTA لتوسيع مكوّناته الداخلية ثم افتح شروحات DNS والفلترة. استخدم رجوع/تقدم كصفحات حقيقية.',
        simTitle: 'محاكاة تفاعلية للرحلة',
        simSubtitle: 'اضغط على MTA للتوسيع، واضغط على العناصر للشرح التفصيلي.',
        modulesTitle: 'الدروس',
        modulesSubtitle: 'اختر درساً تقنياً',
      },
      footer: {
        tagline: 'التسليم بشكل عملي — من RFC إلى الوارد.',
        quick: 'روابط سريعة',
        contact: 'ابقَ على تواصل',
        contactText: 'أضف روابطك هنا.',
      },
      ui: {
        back: 'رجوع',
        close: 'إغلاق',
        backToMap: 'العودة للخريطة',
        deepDive: 'شرح تفصيلي',
      },
      labels: {
        mta: 'MTA',
        dns: 'DNS',
        filter: 'الفلترة',
        inbox: 'الوارد',
        spam: 'السبام',
      },
      deepDives: {
        dns: {
          level: 'شرح تفصيلي',
          title: 'مصادقة DNS: SPF و DKIM و DMARC',
          bodyHtml:
            '<p>مزود البريد يتحقق من الهوية عبر استعلامات DNS ومقارنة النتائج مع جلسة SMTP وHeaders.</p>' +
            '<div class="diagram">' +
            '<div class="diagram-title">خطوات التحقق</div>' +
            '<span class="chip">1) اتصال SMTP</span>' +
            '<span class="chip">2) استخراج From</span>' +
            '<span class="chip">3) SPF TXT</span>' +
            '<span class="chip">4) DKIM Key</span>' +
            '<span class="chip">5) DMARC Policy</span>' +
            '</div>' +
            '<p><strong>معلومة:</strong> افتح درس المصادقة لمزيد من التفاصيل.</p>',
        },
        filter: {
          level: 'شرح تفصيلي',
          title: 'الفلترة: كيف يتم اتخاذ القرار',
          bodyHtml:
            '<p>الفلترة عبارة عن خط معالجة يجمع المصادقة والسمعة والمحتوى وإشارات التفاعل.</p>' +
            '<div class="diagram">' +
            '<div class="diagram-title">إشارات شائعة</div>' +
            '<span class="chip">Auth</span>' +
            '<span class="chip">Reputation</span>' +
            '<span class="chip">Complaints</span>' +
            '<span class="chip">Bounces</span>' +
            '<span class="chip">Engagement</span>' +
            '</div>',
        },
        inbox: {
          level: 'شرح تفصيلي',
          title: 'الوصول للوارد: الثبات',
          bodyHtml:
            '<p>الوارد حالة يجب الحفاظ عليها عبر ثبات الهوية والسلوك.</p><ul><li>SPF/DKIM pass و DMARC alignment.</li><li>إرسال ثابت بدون قفزات.</li></ul>',
        },
        spam: {
          level: 'شرح تفصيلي',
          title: 'السبام وحلقة الشكاوى',
          bodyHtml:
            '<p>السبام يزيد الشكاوى ويخفض السمعة. قلّل الشكاوى عبر استهداف أفضل وإلغاء اشتراك واضح.</p>',
        },
        'mta-input': {
          level: 'شرح تفصيلي',
          title: 'داخل الـ MTA: قائمة الإدخال',
          bodyHtml:
            '<p>قائمة الإدخال تفصل قبول الرسائل عن عملية الإرسال كي يبقى SMTP سريعاً.</p>',
        },
        'mta-engine': {
          level: 'شرح تفصيلي',
          title: 'داخل الـ MTA: محرك المعالجة',
          bodyHtml:
            '<p>سياسات، توقيع DKIM، توجيه، throttling، وتصنيف الأخطاء.</p>',
        },
        'mta-rotate': {
          level: 'شرح تفصيلي',
          title: 'داخل الـ MTA: تدوير IP',
          bodyHtml:
            '<p>التدوير يجب أن يحافظ على السمعة، ويعتمد على warm-up تدريجي واستهداف domain-based shaping.</p>',
        },
        'mta-out': {
          level: 'شرح تفصيلي',
          title: 'داخل الـ MTA: قائمة الإخراج',
          bodyHtml:
            '<p>Retry مع backoff للـ 4xx وإيقاف بعد مدة صلاحية محددة.</p>',
        },
      },
      lessons: {
        basics: {
          level: 'المستوى 1',
          title: 'تركيب البريد (بنية حقيقية)',
          description: 'Envelope مقابل Headers/Body ولماذا يهم ذلك.',
          bodyHtml:
            '<p>الرسالة طبقتان: Envelope في SMTP، والمحتوى في RFC5322.</p><ul><li>SPF مرتبط بالـ Envelope.</li><li>DKIM مرتبط بالـ Headers/Body.</li></ul>',
        },
        auth: {
          level: 'المستوى 2',
          title: 'المصادقة بشكل تقني (SPF/DKIM/DMARC)',
          description: 'Records و alignment وأخطاء شائعة.',
          bodyHtml:
            '<p>التوافق (Alignment) هو المفتاح في DMARC.</p><ul><li>ابدأ بـ p=none ثم ارفع السياسة تدريجياً.</li></ul>',
        },
        mta: {
          level: 'المستوى 3',
          title: 'هندسة الـ MTA + Warm-up',
          description: 'Queues و throttling و retries وتدوير IP.',
          bodyHtml:
            '<p>الـ MTA محرك تسليم يحتاج shaping لكل domain وسياسة retries دقيقة.</p><p><strong>نصيحة:</strong> اضغط على MTA بالخريطة لاستكشاف المكونات.</p>',
        },
        deliverability: {
          level: 'المستوى 2',
          title: 'التسليم والسمعة',
          description: 'كيف يتم اتخاذ القرار على نطاق واسع.',
          bodyHtml:
            '<p>التسليم = سمعة + مصادقة + تفاعل + ثبات.</p>',
        },
        content: {
          level: 'المستوى 2',
          title: 'المحتوى ومحفزات السبام',
          description: 'المحتوى يزيد المخاطر لكنه ليس السبب الوحيد.',
          bodyHtml:
            '<p>الأسباب الرئيسية غالباً: قائمة سيئة أو سمعة ضعيفة.</p>',
        },
        troubleshooting: {
          level: 'المستوى 3',
          title: 'تشخيص مشاكل الوصول',
          description: 'قائمة فحص تقنية.',
          bodyHtml:
            '<p>تحقق من SPF/DKIM/DMARC، السمعة، الشكاوى، والحجم.</p>',
        },
      },
      legal: {
        privacy: {
          title: 'سياسة الخصوصية',
          bodyHtml:
            '<p><strong>تاريخ السريان:</strong> 2026-02-11</p>' +
            '<p>توضح هذه السياسة كيفية التعامل مع المعلومات عند استخدام أكاديمية الإيميل.</p>' +
            '<h3>المعلومات التي نجمعها</h3>' +
            '<p>لا نجمع معلومات شخصية عمداً عبر هذا التطبيق التعليمي الثابت إلا إذا تم تقديمها عبر خدمات خارجية.</p>' +
            '<h3>الكوكيز وخدمات الطرف الثالث</h3>' +
            '<p>قد تستخدم خدمات مدمجة (مثل الخطوط أو التحليلات) سياساتها الخاصة.</p>',
        },
        terms: {
          title: 'شروط الخدمة',
          bodyHtml:
            '<p><strong>تاريخ السريان:</strong> 2026-02-11</p>' +
            '<p>باستخدامك للخدمة فأنت توافق على هذه الشروط. المحتوى تعليمي ولا يُعد استشارة.</p>' +
            '<h3>الاستخدام المقبول</h3>' +
            '<p>لا يجوز استخدام الخدمة لإرسال سبام أو انتهاك القوانين.</p>',
        },
        disclaimer: {
          title: 'إخلاء مسؤولية',
          bodyHtml:
            '<p>المحتوى للتعليم العام فقط ولا يضمن الوصول للوارد. استخدمه على مسؤوليتك.</p>',
        },
      },
    },
  };

  window.APP_CONTENT = CONTENT;
})();
