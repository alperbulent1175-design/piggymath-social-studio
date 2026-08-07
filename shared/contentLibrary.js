// PiggyMath canonical content library.
// SINGLE SOURCE OF TRUTH: imported by both the React frontend (src/) and the
// Node publishing backend (server/). Do not fork this list — preset ids must
// match on both sides or /api/publish-now silently publishes the wrong post.

export const CONTENT_PRESETS = [
  {
    id: 'se-tax-trap-153',
    pinTitle: "The 15.3% Self-Employment Tax Trap Explained",
    category: 'VERGİ HESABI & 1099',
    badge: '15.3% SE TAX TRAP',
    hookTitle: 'Send this to a freelancer friend before tax season! 🚨',
    mainHeading: 'The 15.3% Self-Employment Tax Trap',
    subtitle: 'W-2 employees share half their tax with employers. As a 1099 freelancer, YOU pay both sides.',
    bullets: [
      '📊 Social Security Tax: 12.4% (Up to cap)',
      '🏥 Medicare Tax: 2.9% (Unlimited)',
      '💡 Total SE Tax = 15.3% ON TOP of regular income tax!'
    ],
    highlightBox: {
      title: 'Quick PiggyMath Formula:',
      text: 'Gross 1099 Income x 92.35% x 15.3% = Your SE Tax'
    },
    defaultTheme: 'navy',
    ctaText: 'Calculate your exact SE Tax free at piggymath.com 🐷',
    igCaption: `🚨 FREELANCERS & 1099 WORKERS: Are you setting aside enough for taxes?\n\nUnlike W-2 jobs where your boss pays 7.65% of your FICA taxes, as a freelancer you pay the full 15.3% Self-Employment Tax yourself!\n\nTag a freelancer friend who needs to see this! 👇\n\n#PiggyMath #TaxTips #1099Freelancer #SelfEmploymentTax #MoneyMath #FreelanceTips`,
    pinterestDescription: `Understand the 15.3% Self-Employment Tax for 1099 freelancers and self-employed professionals. Calculate your taxes easily with free financial calculators at PiggyMath.com.`
  },
  {
    id: 'w2-vs-1099-breakdown',
    pinTitle: "$100k W-2 Salary vs $100k 1099 Freelance Income",
    category: 'MUKAYESE & KARŞILAŞTIRMA',
    badge: 'W-2 VS 1099 BREAKDOWN',
    hookTitle: '$100k Salary vs $100k 1099: Who actually keeps more?',
    mainHeading: '$100k W-2 Salary vs. $100k 1099 Freelance',
    subtitle: 'Why $100,000 as a freelancer is NOT the same as $100,000 as an employee.',
    comparison: {
      col1Title: 'W-2 Employee ($100k)',
      col1Items: ['Employer pays 7.65% FICA', 'Paid time off & health benefits', 'Net Take Home: ~$78,200'],
      col2Title: '1099 Freelancer ($100k)',
      col2Items: ['You pay 15.3% SE Tax ($14,130)', 'Self-paid health & no PTO', 'Net Take Home: ~$68,400*']
    },
    // The server-side card renderer draws a single bullet column, so this preset
    // carries a flattened version of `comparison` above. Keep the two in sync.
    bullets: [
      'W-2 ($100k): employer pays half your FICA, plus PTO and benefits',
      '1099 ($100k): you pay the full 15.3% SE tax, about $14,130',
      'Net take home: ~$78,200 as W-2 vs ~$68,400 as 1099'
    ],
    highlightBox: {
      title: 'Pro Tip:',
      text: 'Rule of thumb: Charge 25-30% higher hourly rate on 1099 to match a W-2 salary!'
    },
    defaultTheme: 'pink',
    ctaText: 'Compare 1099 vs W-2 net income at piggymath.com ⚖️',
    igCaption: `⚖️ Is a $100k freelance contract really better than a $100k W-2 offer?\n\nBefore you quit your job, remember that 1099 income comes with extra taxes and overhead costs. Here is the realistic breakdown!\n\nSave this post for your next client rate negotiation! 📌\n\n#PiggyMath #W2vs1099 #FreelanceRate #SideHustleTax #TaxDeductions #FinancialFreedom`,
    pinterestDescription: `Comparing $100k W-2 salary vs $100k 1099 freelance income. Calculate your take-home pay and tax obligations on PiggyMath.com.`
  },
  {
    id: 'quarterly-tax-deadlines',
    pinTitle: "IRS Quarterly Estimated Tax Payment Deadlines",
    category: 'ÖNEMLİ TARİHLER',
    badge: 'QUARTERLY TAX CALENDAR',
    hookTitle: 'Save this! IRS Quarterly Estimated Tax Deadlines 📅',
    mainHeading: '4 Dates Every Freelancer Must Put On Their Calendar',
    subtitle: 'Miss these dates and the IRS will charge underpayment penalties!',
    bullets: [
      '🌸 Q1 (Jan 1 - Mar 31) ➔ Due: April 15',
      '☀️ Q2 (Apr 1 - May 31) ➔ Due: June 15',
      '🍂 Q3 (Jun 1 - Aug 31) ➔ Due: Sept 15',
      '❄️ Q4 (Sep 1 - Dec 31) ➔ Due: Jan 15 (Next Yr)'
    ],
    highlightBox: {
      title: 'IRS Penalty Avoidance:',
      text: 'Pay at least 90% of current year tax or 100% of last year tax to stay safe.'
    },
    defaultTheme: 'light',
    ctaText: 'Calculate your quarterly payment free on piggymath.com 📅',
    igCaption: `📅 Mark your calendars! If you make over $1,000 in 1099 income, the IRS expects quarterly payments.\n\nDon't let IRS penalties surprise you at year-end. Save this pin/post to stay ahead!\n\n#PiggyMath #QuarterlyTaxes #TaxDeadline #FreelanceTax #IRSDeadlines #SmartMoney`,
    pinterestDescription: `Official IRS quarterly estimated tax payment deadlines for 1099 contractors and freelancers. Use PiggyMath.com quarterly tax calculator.`
  },
  {
    id: 'home-office-deduction',
    pinTitle: "Home Office Tax Deduction: 2 Ways to Claim It",
    category: 'VERGİ İNDİRİMLERİ',
    badge: 'HOME OFFICE DEDUCTION',
    hookTitle: 'Do you work from home? Don\'t leave money on the table! 🏠',
    mainHeading: '2 Ways to Claim the Home Office Tax Deduction',
    subtitle: 'If you have a dedicated workspace at home, you qualify for this tax write-off.',
    bullets: [
      '1️⃣ Simplified Method: $5 per sq ft (Up to 300 sq ft = $1,500 max deduction)',
      '2️⃣ Actual Expense Method: Deduct % of Rent, Utilities, Wi-Fi & Insurance!'
    ],
    highlightBox: {
      title: 'Requirement:',
      text: 'Space must be used exclusively & regularly for business purposes.'
    },
    defaultTheme: 'mint',
    ctaText: 'Calculate your home office deduction on piggymath.com 🏡',
    igCaption: `🏡 Working from home? You could save hundreds or thousands on your tax bill with the Home Office Deduction!\n\nShare this with a remote worker or freelancer! 📲\n\n#PiggyMath #HomeOfficeDeduction #TaxWriteOffs #RemoteWorkTax #FreelanceDeductions #MoneyHacks`,
    pinterestDescription: `How to calculate your home office deduction: Simplified vs Actual expenses method. Check your eligible write-offs at PiggyMath.com.`
  },
  {
    id: 'freelance-hourly-rate-formula',
    pinTitle: "How to Calculate Your True Freelance Hourly Rate",
    category: 'FİYATLAMA & HESAPLAMA',
    badge: 'FREELANCE RATE FORMULA',
    hookTitle: 'How to calculate your true hourly rate as a 1099 freelancer ⏱️',
    mainHeading: 'Don\'t Divide Desired Salary by 2,000 Hours!',
    subtitle: 'As a freelancer, only ~60% of your working hours are actually billable.',
    bullets: [
      '🎯 Desired Annual Net Income: $80,000',
      '➕ Add Taxes (25%) + Business Expenses ($10,000) = $110,000 Needed',
      '⏱️ Billable Hours (25 hrs/wk x 48 wks = 1,200 hrs)',
      '⚡ Required Rate = $110,000 / 1,200 = $91.60/hr'
    ],
    highlightBox: {
      title: 'PiggyMath Golden Rule:',
      text: 'Hourly Rate = (Target Income + Taxes + Overhead) / Billable Hours'
    },
    defaultTheme: 'navy',
    ctaText: 'Find your target freelance hourly rate at piggymath.com ⏱️',
    igCaption: `⏱️ Stop undercharging for your freelance services!\n\nRemember that admin, invoicing, marketing, and taxes eat into your billable time. Use this formula to set profitable rates.\n\n#PiggyMath #FreelanceRate #HourlyRate #PricingStrategy #FreelanceBusiness #MoneyMath`,
    pinterestDescription: `Calculate your ideal freelance hourly rate including taxes, health insurance, and non-billable hours. Use free tools at PiggyMath.com.`
  },
  {
    id: 'compound-interest-magic',
    pinTitle: "Compound Interest: The Cost of Starting 10 Years Late",
    category: 'YATIRIM & BİLEŞİK FAİZ',
    badge: 'COMPOUND INTEREST MAGIC',
    hookTitle: 'How $200/month turns into $300,000+ with Compound Interest 📈',
    mainHeading: 'The Power of Starting 10 Years Earlier',
    subtitle: 'Consistency beats timing. See how exponential growth works over time.',
    bullets: [
      '🌱 Start at age 25 ($200/mo at 8% return) ➔ $349,000 at age 65',
      '⏳ Start at age 35 ($200/mo at 8% return) ➔ $149,000 at age 65',
      '💥 10-Year Delay Cost You: $200,000+ in pure compound growth!'
    ],
    highlightBox: {
      title: 'Key Takeaway:',
      text: 'Time in the market is your greatest financial asset.'
    },
    defaultTheme: 'pink',
    ctaText: 'Simulate your compound interest growth free at piggymath.com 📈',
    igCaption: `📈 Compound interest is the 8th wonder of the world!\n\nSmall monthly contributions early in life build massive wealth thanks to exponential compounding.\n\nTag someone who needs to start investing today! 🚀\n\n#PiggyMath #CompoundInterest #WealthBuilding #InvestingForBeginners #FinancialFreedom #RothIRA`,
    pinterestDescription: `Visual comparison of compound interest growth over 10, 20, and 30 years. Calculate your potential savings at PiggyMath.com.`
  },
  {
    id: '1099k-threshold-rules',
    pinTitle: "1099-K Reporting Threshold Rules for PayPal, Stripe & Venmo",
    category: 'VERGİ KURALLARI & 1099-K',
    badge: '1099-K THRESHOLD CHECKER',
    hookTitle: 'Did you get paid on Venmo, Stripe, or PayPal? 📱',
    mainHeading: '1099-K Reporting Threshold Rules Explained',
    subtitle: 'Payment processors are required to report your business transactions to the IRS.',
    bullets: [
      '📲 Form 1099-K tracks goods & services transactions',
      '💡 Personal payments (splitting dinner, gifts) are NOT taxable',
      '🧾 Keep clean business accounting records to avoid IRS confusion'
    ],
    highlightBox: {
      title: 'Pro Tip:',
      text: 'Always separate your personal Venmo/PayPal from your business accounts!'
    },
    defaultTheme: 'light',
    ctaText: 'Check your 1099-K threshold status at piggymath.com 📱',
    igCaption: `📱 Getting payments on PayPal, Stripe, or Venmo?\n\nMake sure you know the difference between personal reimbursements and taxable 1099-K income!\n\n#PiggyMath #1099K #StripeTaxes #PayPalTaxes #VenmoTax #FreelanceTaxes`,
    pinterestDescription: `Understand the IRS 1099-K reporting threshold rules for PayPal, Stripe, and Venmo payments. Calculate your taxes at PiggyMath.com.`
  },
  {
    id: 'standard-mileage-deduction',
    pinTitle: "IRS Standard Mileage Rate Deduction Guide",
    category: 'MİLAJ & TAŞIT İNDİRİMİ',
    badge: 'MILEAGE DEDUCTION',
    hookTitle: 'Do you drive for business? Don\'t miss this write-off! 🚗',
    mainHeading: 'IRS Standard Mileage Rate Tax Write-Off',
    subtitle: 'Every business mile driven is money off your taxable income.',
    bullets: [
      '🚗 Track all client trips, supply runs, & bank visits',
      '📊 1,000 Business Miles x IRS Rate = Hundreds in Tax Savings!',
      '📱 Use a mileage tracking app or logbook for IRS proof'
    ],
    highlightBox: {
      title: 'Rule of Thumb:',
      text: 'Commuting from home to regular job is NOT deductible, but business trips ARE!'
    },
    defaultTheme: 'mint',
    ctaText: 'Calculate your mileage tax deduction free on piggymath.com 🚗',
    igCaption: `🚗 Are you tracking your business mileage?\n\nWhether you drive to client meetings, office supply stores, or post offices, every business mile reduces your tax bill!\n\n#PiggyMath #MileageDeduction #TaxWriteOff #FreelancerCar #BusinessExpenses`,
    pinterestDescription: `IRS standard mileage rate deduction guide for freelancers and business owners. Calculate your savings at PiggyMath.com.`
  },
  {
    id: 's-corp-tax-savings-threshold',
    pinTitle: "When to Elect S-Corp Status to Save on Taxes",
    category: 'ŞİRKET YAPISI & S-CORP',
    badge: 'S-CORP SAVINGS THRESHOLD',
    hookTitle: 'Making $80k+ freelance? Time to switch to an S-Corp? 🏢',
    mainHeading: 'When to Elect S-Corp Status to Save Thousands',
    subtitle: 'LLC vs S-Corp tax structure break-even calculation.',
    bullets: [
      '💡 Under $80k net income ➔ Standard Sole Proprietorship / LLC is cheaper',
      '🚀 Over $80k net income ➔ S-Corp salary + distribution splits SE Tax!',
      '💰 Potential Tax Savings = $3,000 - $8,000+ per year'
    ],
    highlightBox: {
      title: 'PiggyMath Threshold:',
      text: 'When S-Corp tax savings exceed payroll & accounting fees, MAKE THE SWITCH!'
    },
    defaultTheme: 'navy',
    ctaText: 'Find your S-Corp break-even point on piggymath.com 🏢',
    igCaption: `🏢 High-earning freelancer or agency owner?\n\nElecting S-Corp status can save you thousands in self-employment taxes once your net income crosses $80k!\n\n#PiggyMath #SCorp #LLCvSCorp #TaxSavings #SmallBusinessTax #FreelanceWealth`,
    pinterestDescription: `When to switch from LLC to S-Corp status for maximum self-employment tax savings. Calculate at PiggyMath.com.`
  },
  {
    id: '50-30-20-budgeting-rule',
    pinTitle: "The 50/30/20 Budget Rule Explained",
    category: 'BÜTÇE & FİNANSAL PLANLAMA',
    badge: '50/30/20 BUDGET RULE',
    hookTitle: 'The simplest budgeting rule for financial freedom 🎯',
    mainHeading: 'How to Divide Your Monthly Income Effortlessly',
    subtitle: 'A proven framework to balance living today and building wealth tomorrow.',
    bullets: [
      '🏠 50% Needs (Rent, Utilities, Groceries, Insurance)',
      '🎉 30% Wants (Dining out, Travel, Entertainment)',
      '📈 20% Savings & Debt Payoff (Investments, Emergency Fund)'
    ],
    highlightBox: {
      title: 'Freelancer Adjustment:',
      text: 'Set aside tax money BEFORE applying the 50/30/20 budget formula!'
    },
    defaultTheme: 'pink',
    ctaText: 'Calculate your 50/30/20 budget breakdown on piggymath.com 🎯',
    igCaption: `🎯 Stop overcomplicating your monthly budget!\n\nThe 50/30/20 rule gives you complete financial clarity without restrictive spreadsheet tracking.\n\nSave this for your next payday! 📌\n\n#PiggyMath #Budgeting #503020Rule #PersonalFinance #FinancialGoals #MoneyManagement`,
    pinterestDescription: `50/30/20 rule budget breakdown formula for financial independence. Calculate your monthly targets at PiggyMath.com.`
  }
];
