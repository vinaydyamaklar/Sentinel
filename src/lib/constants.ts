import type { SourceOfFunds } from '../types/client'

export const BRANCHES = [
  'Mayfair',
  'Edinburgh',
  'Manchester',
  'Canary Wharf',
] as const

export const SOURCE_OF_FUNDS: SourceOfFunds[] = [
  'Employment',
  'Business Income',
  'Investment Returns',
  'Inheritance',
  'Property Sale',
  'Pension',
  'Gift',
  'Other',
]

export const KYC_STATUSES = [
  'APPROVED',
  'PENDING',
  'REJECTED',
  'ENHANCED_DUE_DILIGENCE',
] as const

// HIGH risk country list
export const HIGH_RISK_COUNTRIES = [
  'Russia',
  'Belarus',
  'Venezuela',
] as const

// MEDIUM risk country list
export const MEDIUM_RISK_COUNTRIES = [
  'Brazil',
  'Turkey',
  'South Africa',
  'Mexico',
  'UAE',
  'China',
] as const

// MEDIUM risk: income threshold
export const MEDIUM_INCOME_THRESHOLD = 500_000

// MEDIUM risk: source of funds that trigger when income > threshold
export const MEDIUM_RISK_FUND_SOURCES: SourceOfFunds[] = [
  'Inheritance',
  'Gift',
  'Other',
]

export const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia',
  'Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium',
  'Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei',
  'Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon','Canada','Central African Republic',
  'Chad','Chile','China','Colombia','Comoros','Congo','Costa Rica','Croatia','Cuba','Cyprus',
  'Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador',
  'Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France','Gabon',
  'Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana',
  'Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy',
  'Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan','Laos','Latvia',
  'Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi',
  'Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia',
  'Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal',
  'Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway',
  'Oman','Pakistan','Palau','Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines',
  'Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia',
  'Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe','Saudi Arabia',
  'Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands',
  'Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden',
  'Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga',
  'Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','UAE','Uganda','Ukraine',
  'United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu','Venezuela','Vietnam',
  'Yemen','Zambia','Zimbabwe',
]

export const FIELD_LABELS: Record<string, string> = {
  client_id:                  'Client ID',
  branch:                     'Branch',
  onboarding_date:            'Onboarding Date',
  client_name:                'Full Name',
  client_type:                'Client Type',
  country_of_tax_residence:   'Country of Tax Residence',
  annual_income:              'Annual Income',
  source_of_funds:            'Source of Funds',
  pep_status:                 'PEP Status',
  sanctions_screening_match:  'Sanctions Screening Match',
  adverse_media_flag:         'Adverse Media Flag',
  kyc_status:                 'KYC Status',
  documentation_complete:     'Documentation Complete',
  relationship_manager:       'Relationship Manager',
}

export const STORAGE_KEY = 'sentinel_clients'

export const DEFAULT_PAGE_SIZE = 15