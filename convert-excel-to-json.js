const XLSX = require('./api/node_modules/xlsx');
const fs = require('fs');
const path = require('path');

// Read the Excel file
const excelPath = path.join(process.env.HOME, 'Downloads', 'lksy-standards-lists.xlsx');
const outputDir = path.join(__dirname, 'community-standards', 'lists');

if (!fs.existsSync(excelPath)) {
  console.error('Excel file not found:', excelPath);
  process.exit(1);
}

const workbook = XLSX.readFile(excelPath);
const today = new Date().toISOString().split('T')[0];

// Mapping of Excel sheet names to list IDs and metadata
const sheetMapping = {
  'spam_triggers_standard': {
    id: 'email-spam-triggers',
    name: 'Email Spam Triggers',
    description: 'Words and patterns that trigger email spam filters',
    type: 'checks',
    tags: ['email', 'deliverability', 'spam', 'content'],
    convertRow: (row) => ({
      id: row['Word/Phrase']?.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 50) || `check-${Math.random().toString(36).substr(2, 9)}`,
      name: row['Word/Phrase'] || 'Unknown',
      severity: mapSeverity(row['Severity']),
      description: row['Notes'] || row['Word/Phrase'] || '',
      rationale: row['Category'] ? `Category: ${row['Category']}` : undefined,
      automatable: true,
      detection_method: 'pattern_matching',
      false_positive_rate: row['Context Matters'] === 'Yes' ? 'medium' : 'low',
      status: 'approved'
    })
  },
  'deliverability_standard': {
    id: 'email-deliverability',
    name: 'Email Deliverability Standards',
    description: 'Technical standards for email deliverability and authentication',
    type: 'checks',
    tags: ['email', 'deliverability', 'technical', 'authentication'],
    convertRow: (row) => ({
      id: row['Check Name']?.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 50) || `check-${Math.random().toString(36).substr(2, 9)}`,
      name: row['Check Name'] || 'Unknown',
      severity: mapSeverity(row['Severity']),
      description: row['Description'] || '',
      rationale: row['Protocol/Standard'] ? `Based on ${row['Protocol/Standard']}` : undefined,
      automatable: row['Automatable'] === 'Yes',
      detection_method: 'protocol_check',
      false_positive_rate: 'very_low',
      status: 'approved'
    })
  },
  'accessibility_standard': {
    id: 'email-accessibility',
    name: 'Email Accessibility Standards',
    description: 'WCAG-compliant accessibility checks for email content',
    type: 'checks',
    tags: ['email', 'accessibility', 'wcag', 'a11y'],
    convertRow: (row) => ({
      id: row['Check ID']?.toLowerCase().replace(/[^a-z0-9-]/g, '-') || row['Check Name']?.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 50) || `check-${Math.random().toString(36).substr(2, 9)}`,
      name: row['Check Name'] || 'Unknown',
      severity: mapSeverity(row['Severity']),
      description: row['Description'] || '',
      rationale: row['WCAG Level'] ? `WCAG ${row['WCAG Level']} compliance` : undefined,
      automatable: row['Automatable'] === 'Yes',
      detection_method: 'code_analysis',
      false_positive_rate: 'low',
      status: 'approved'
    })
  },
  'utm_standard': {
    id: 'utm-standards',
    name: 'UTM Parameter Standards',
    description: 'Standard values and formats for UTM tracking parameters',
    type: 'values',
    tags: ['analytics', 'tracking', 'utm', 'marketing'],
    convertRow: (row) => row // For values type, we'll structure differently
  },
  'privacy_standard': {
    id: 'gdpr-compliance',
    name: 'GDPR Compliance Checklist',
    description: 'Privacy and data protection compliance checks',
    type: 'checks',
    tags: ['privacy', 'gdpr', 'compliance', 'legal'],
    convertRow: (row) => ({
      id: row['Check Name']?.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 50) || `check-${Math.random().toString(36).substr(2, 9)}`,
      name: row['Check Name'] || 'Unknown',
      severity: mapSeverity(row['Severity']),
      description: row['Description'] || '',
      rationale: row['Regulation'] ? `Required by ${row['Regulation']}` : undefined,
      automatable: row['Automatable'] === 'Yes',
      detection_method: 'code_analysis',
      false_positive_rate: 'low',
      status: 'approved'
    })
  },
  'clients_standard': {
    id: 'email-client-standards',
    name: 'Email Client Testing Standards',
    description: 'Priority email clients and platforms for testing',
    type: 'values',
    tags: ['email', 'testing', 'clients', 'compatibility'],
    convertRow: (row) => row
  },
  'browsers_standard': {
    id: 'browser-testing-standards',
    name: 'Browser Testing Standards',
    description: 'Priority browsers and versions for web testing',
    type: 'values',
    tags: ['web', 'testing', 'browsers', 'compatibility'],
    convertRow: (row) => row
  },
  'devices_standard': {
    id: 'device-testing-standards',
    name: 'Device Testing Standards',
    description: 'Standard device viewports and breakpoints for responsive testing',
    type: 'values',
    tags: ['web', 'testing', 'devices', 'responsive', 'viewport'],
    convertRow: (row) => row
  },
  'qa_email_standard': {
    id: 'email-qa-standards',
    name: 'Email QA Standards',
    description: 'Comprehensive quality assurance checks for email campaigns',
    type: 'checks',
    tags: ['email', 'qa', 'quality', 'testing'],
    convertRow: (row) => ({
      id: row['Check Name']?.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 50) || `check-${Math.random().toString(36).substr(2, 9)}`,
      name: row['Check Name'] || 'Unknown',
      severity: mapSeverity(row['Severity']),
      description: row['Description'] || '',
      rationale: row['Category'] ? `Category: ${row['Category']}` : undefined,
      automatable: row['Validation Method'] === 'Code',
      detection_method: row['Validation Method']?.toLowerCase() === 'code' ? 'code_analysis' : 'manual_review',
      false_positive_rate: 'medium',
      status: 'approved'
    })
  },
  'qa_webpage_standard': {
    id: 'webpage-qa-standards',
    name: 'Webpage QA Standards',
    description: 'Comprehensive quality assurance checks for web pages',
    type: 'checks',
    tags: ['web', 'qa', 'quality', 'testing', 'performance'],
    convertRow: (row) => ({
      id: row['Check Name']?.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 50) || `check-${Math.random().toString(36).substr(2, 9)}`,
      name: row['Check Name'] || 'Unknown',
      severity: mapSeverity(row['Severity']),
      description: row['Description'] || '',
      rationale: row['Category'] ? `Category: ${row['Category']}` : undefined,
      automatable: row['Validation Method'] === 'Code',
      detection_method: row['Validation Method']?.toLowerCase() === 'code' ? 'code_analysis' : 'manual_review',
      false_positive_rate: 'medium',
      status: 'approved'
    })
  },
  'validation_firstname': {
    id: 'firstname-validation',
    name: 'First Name Validation Standards',
    description: 'Validation rules and checks for first name personalization',
    type: 'checks',
    tags: ['validation', 'personalization', 'data-quality'],
    convertRow: (row) => ({
      id: row['Check Name']?.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 50) || `check-${Math.random().toString(36).substr(2, 9)}`,
      name: row['Check Name'] || 'Unknown',
      severity: mapSeverity(row['Severity']),
      description: row['Description'] || '',
      rationale: row['Pattern/Rule'] ? `Pattern: ${row['Pattern/Rule']}` : undefined,
      automatable: row['Automatable'] === 'Yes',
      detection_method: 'pattern_matching',
      false_positive_rate: 'very_low',
      status: 'approved'
    })
  },
  'validation_lastname': {
    id: 'lastname-validation',
    name: 'Last Name Validation Standards',
    description: 'Validation rules and checks for last name personalization',
    type: 'checks',
    tags: ['validation', 'personalization', 'data-quality'],
    convertRow: (row) => ({
      id: row['Check Name']?.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 50) || `check-${Math.random().toString(36).substr(2, 9)}`,
      name: row['Check Name'] || 'Unknown',
      severity: mapSeverity(row['Severity']),
      description: row['Description'] || '',
      rationale: row['Pattern/Rule'] ? `Pattern: ${row['Pattern/Rule']}` : undefined,
      automatable: row['Automatable'] === 'Yes',
      detection_method: 'pattern_matching',
      false_positive_rate: 'very_low',
      status: 'approved'
    })
  },
  'validation_company': {
    id: 'company-validation',
    name: 'Company Name Validation Standards',
    description: 'Validation rules and checks for company name personalization',
    type: 'checks',
    tags: ['validation', 'personalization', 'data-quality'],
    convertRow: (row) => ({
      id: row['Check Name']?.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 50) || `check-${Math.random().toString(36).substr(2, 9)}`,
      name: row['Check Name'] || 'Unknown',
      severity: mapSeverity(row['Severity']),
      description: row['Description'] || '',
      rationale: row['Pattern/Rule'] ? `Pattern: ${row['Pattern/Rule']}` : undefined,
      automatable: row['Automatable'] === 'Yes',
      detection_method: 'pattern_matching',
      false_positive_rate: 'very_low',
      status: 'approved'
    })
  }
};

function mapSeverity(severity) {
  if (!severity) return 'major';
  const s = severity.toLowerCase();
  if (s.includes('critical') || s === 'high') return 'critical';
  if (s.includes('major') || s === 'medium') return 'major';
  if (s.includes('minor') || s === 'low') return 'minor';
  return 'recommended';
}

// Process each sheet
workbook.SheetNames.forEach((sheetName) => {
  const mapping = sheetMapping[sheetName];
  if (!mapping) {
    console.warn(`No mapping found for sheet: ${sheetName}`);
    return;
  }

  console.log(`Processing: ${sheetName} -> ${mapping.id}`);
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: null });

  let listData;
  
  if (mapping.type === 'checks') {
    const checks = rows.map((row, index) => {
      const check = mapping.convertRow(row);
      // Ensure unique IDs
      if (!check.id || check.id === 'unknown') {
        check.id = `${mapping.id}-check-${index + 1}`;
      }
      return check;
    }).filter(check => check.name && check.name !== 'Unknown');

    listData = {
      id: mapping.id,
      version: '1.0.0',
      name: mapping.name,
      description: mapping.description,
      type: 'checks',
      status: 'active',
      maintainers: [],
      tags: mapping.tags,
      first_published: today,
      last_updated: today,
      seo: {
        title: `${mapping.name} v1.0.0 | lksy.org`,
        description: `${mapping.description}. Free, open source, version-controlled community standards.`,
        keywords: [...mapping.tags, 'community standards', 'qa standards']
      },
      checks: checks
    };
  } else {
    // For values type, structure the data differently
    const values = rows.map((row, index) => {
      const converted = mapping.convertRow(row);
      return {
        id: `${mapping.id}-${index + 1}`,
        ...converted
      };
    });

    listData = {
      id: mapping.id,
      version: '1.0.0',
      name: mapping.name,
      description: mapping.description,
      type: 'values',
      status: 'active',
      maintainers: [],
      tags: mapping.tags,
      first_published: today,
      last_updated: today,
      seo: {
        title: `${mapping.name} v1.0.0 | lksy.org`,
        description: `${mapping.description}. Free, open source, version-controlled community standards.`,
        keywords: [...mapping.tags, 'community standards', 'qa standards']
      },
      values: {
        items: values
      }
    };
  }

  // Write JSON file
  const jsonPath = path.join(outputDir, `${mapping.id}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(listData, null, 2));
  console.log(`  ✓ Created ${jsonPath} (${mapping.type === 'checks' ? listData.checks.length : listData.values.items.length} items)`);
});

console.log('\n✅ Conversion complete!');
