import os

# 1. Update app-shell.component.ts
p1 = "frontend/src/app/layout/app-shell/app-shell.component.ts"
if os.path.exists(p1):
    with open(p1, "r", encoding="utf-8") as f:
        c1 = f.read()
    old_brand = """        <!-- Brand -->
        <div class="flex items-center gap-2">
          <div class="font-bold text-xl tracking-tighter text-white">AI CRM</div>
        </div>"""
    new_brand = """        <!-- Brand -->
        <div class="flex items-center gap-3">
          <div class="font-bold text-xl tracking-tighter text-white">Healthcare CRM</div>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            HIPAA Shield
          </span>
          <span class="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            K8s Blue-Green
          </span>
        </div>"""
    c1 = c1.replace(old_brand.replace("\r\n", "\n"), new_brand.replace("\r\n", "\n"))
    c1 = c1.replace("Customers\n          </a>", "Patients\n          </a>")
    with open(p1, "w", encoding="utf-8", newline="") as f:
        f.write(c1)
    print("Updated app-shell.component.ts")

# 2. Update landing.component.html
p2 = "frontend/src/app/pages/landing/landing.component.html"
if os.path.exists(p2):
    with open(p2, "r", encoding="utf-8") as f:
        c2 = f.read()
    old_hero = """        <div class="inline-block text-label-caps text-gray-400 mb-6 tracking-[0.1em] hero-item">
          AI-Native Consumer Engagement
        </div>"""
    new_hero = """        <div class="flex items-center gap-2 mb-6 hero-item">
          <span class="inline-block text-label-caps text-gray-400 tracking-[0.1em]">
            Healthcare Patient Engagement & Mini CRM
          </span>
          <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            HIPAA DevSecOps
          </span>
        </div>"""
    c2 = c2.replace(old_hero.replace("\r\n", "\n"), new_hero.replace("\r\n", "\n"))
    c2 = c2.replace(
        "The CRM that proactively surfaces high-opportunity segments, drafts personalized campaigns, and tracks performance across every channel.",
        "The clinical engagement CRM that proactively surfaces high-risk patient cohorts, drafts personalized treatment reminders, and ensures HIPAA-compliant engagement across every channel."
    )
    c2 = c2.replace(
        '<div class="font-bold text-xl tracking-tighter text-white">AI CRM</div>',
        '<div class="font-bold text-xl tracking-tighter text-white">Healthcare Patient CRM</div>'
    )
    with open(p2, "w", encoding="utf-8", newline="") as f:
        f.write(c2)
    print("Updated landing.component.html")

# 3. Update dashboard.component.html
p3 = "frontend/src/app/pages/dashboard/dashboard.component.html"
if os.path.exists(p3):
    with open(p3, "r", encoding="utf-8") as f:
        c3 = f.read()
    c3 = c3.replace(
        "Workspace Dashboard",
        "Clinical Patient Dashboard"
    )
    c3 = c3.replace(
        "Overview of customers and recent orders.",
        "Overview of patient care tiers, clinical appointments, and treatment revenue."
    )
    c3 = c3.replace("Total Contacts</p>", "Total Patients (HIPAA Shield)</p>")
    c3 = c3.replace("Add Contact</button>", "View Patients</button>")
    with open(p3, "w", encoding="utf-8", newline="") as f:
        f.write(c3)
    print("Updated dashboard.component.html")

# 4. Update customers.component.html
p4 = "frontend/src/app/pages/customers/customers.component.html"
if os.path.exists(p4):
    with open(p4, "r", encoding="utf-8") as f:
        c4 = f.read()
    old_c_head = """      <h1 class="text-h2 mb-2">Customers</h1>
      <p class="text-body-lg text-gray-400">View and manage your entire customer database.</p>"""
    new_c_head = """      <div class="flex items-center gap-3">
        <h1 class="text-h2 mb-2">Patients & Clinical Profiles</h1>
        <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          PHI Masked & HIPAA Protected
        </span>
      </div>
      <p class="text-body-lg text-gray-400">View and manage protected clinical records, risk levels, and care tiers.</p>"""
    c4 = c4.replace(old_c_head.replace("\r\n", "\n"), new_c_head.replace("\r\n", "\n"))
    
    old_th = """            <th class="px-6 py-4 text-label-caps text-gray-400 font-semibold">Name</th>
            <th class="px-6 py-4 text-label-caps text-gray-400 font-semibold">Email</th>
            <th class="px-6 py-4 text-label-caps text-gray-400 font-semibold">Location</th>
            <th class="px-6 py-4 text-label-caps text-gray-400 font-semibold">Source</th>
            <th class="px-6 py-4 text-label-caps text-gray-400 font-semibold">Joined</th>"""
    new_th = """            <th class="px-6 py-4 text-label-caps text-gray-400 font-semibold">Patient Name</th>
            <th class="px-6 py-4 text-label-caps text-gray-400 font-semibold">Protected Email</th>
            <th class="px-6 py-4 text-label-caps text-gray-400 font-semibold">Care Tier</th>
            <th class="px-6 py-4 text-label-caps text-gray-400 font-semibold">Primary Condition / MRN</th>
            <th class="px-6 py-4 text-label-caps text-gray-400 font-semibold">Registered</th>"""
    c4 = c4.replace(old_th.replace("\r\n", "\n"), new_th.replace("\r\n", "\n"))

    old_td = """              <td class="px-6 py-4 font-semibold text-[15px]">{{ customer.name }}</td>
              <td class="px-6 py-4 text-gray-400 text-[14px]">{{ customer.email }}</td>
              <td class="px-6 py-4 text-gray-400 text-[14px]">{{ customer.metadata_json['location'] || 'Unknown' }}</td>
              <td class="px-6 py-4">
                <span class="panel-recessed text-label-caps px-3 py-1 rounded-full">
                  {{ customer.metadata_json['source'] || 'Unknown' }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-400 text-[14px]">{{ customer.created_at | date:'mediumDate' }}</td>"""
    new_td = """              <td class="px-6 py-4 font-semibold text-[15px]">{{ customer.name }}</td>
              <td class="px-6 py-4 text-gray-400 text-[14px] font-mono">{{ customer.email }}</td>
              <td class="px-6 py-4">
                <span class="panel-recessed text-label-caps px-3 py-1 rounded-full text-indigo-300">
                  {{ customer.metadata_json['care_tier'] || 'Standard' }}
                </span>
              </td>
              <td class="px-6 py-4 text-[14px]">
                <div class="font-medium text-white">{{ customer.metadata_json['primary_condition'] || 'Routine Wellness' }}</div>
                <div class="text-xs text-gray-400 font-mono">{{ customer.metadata_json['mrn'] || 'MRN-SECURED' }}</div>
              </td>
              <td class="px-6 py-4 text-gray-400 text-[14px]">{{ customer.created_at | date:'mediumDate' }}</td>"""
    c4 = c4.replace(old_td.replace("\r\n", "\n"), new_td.replace("\r\n", "\n"))

    with open(p4, "w", encoding="utf-8", newline="") as f:
        f.write(c4)
    print("Updated customers.component.html")
