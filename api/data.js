export const enc = s => encodeURIComponent(String(s || "").trim());

export const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

export const GROUPS = [
  {
    id: "people",
    label: "People Search",
    icon: "👤",
    sources: [
      { name: "TruePeopleSearch", url: q => `https://www.truepeoplesearch.com/results?name=${enc(q.first+" "+q.last)}&citystatezip=${enc(q.city)}` },
      { name: "FastPeopleSearch", url: q => `https://www.fastpeoplesearch.com/name/${enc((q.first+"-"+q.last).toLowerCase())}` },
      { name: "Whitepages", url: q => `https://www.whitepages.com/name/${enc(q.first)}-${enc(q.last)}/${enc(q.city)}` },
      { name: "Spokeo", url: q => `https://www.spokeo.com/${enc(q.first)}-${enc(q.last)}` },
      { name: "Radaris", url: q => `https://radaris.com/p/${enc(q.first)}/${enc(q.last)}/` },
      { name: "Nuwber", url: q => `https://nuwber.com/search?name=${enc(q.first+" "+q.last)}` },
      { name: "ThatsThem", url: q => `https://thatsthem.com/name/${enc(q.first)}-${enc(q.last)}` },
      { name: "CyberBackgroundChecks", url: q => `https://www.cyberbackgroundchecks.com/people/${enc(q.first)}-${enc(q.last)}` }
    ]
  },
  {
    id: "records",
    label: "Public Records",
    icon: "🏛️",
    sources: [
      { name: "CourtListener", url: q => `https://www.courtlistener.com/?q=${enc(q.first+" "+q.last)}` },
      { name: "PACER", url: q => `https://pcl.uscourts.gov/` },
      { name: "SEC EDGAR", url: q => `https://www.sec.gov/cgi-bin/browse-edgar?company=${enc(q.last)}&action=getcompany` },
      { name: "FEC", url: q => `https://www.fec.gov/data/receipts/?contributor_name=${enc(q.first+" "+q.last)}` },
      { name: "OpenCorporates", url: q => `https://opencorporates.com/companies/us_?q=${enc(q.last)}` },
      { name: "Bureau of Prisons", url: q => `https://www.bop.gov/inmateloc/` }
    ]
  },
  {
    id: "states",
    label: "State Records",
    icon: "🗺️",
    sources: US_STATES.map(st => ({
      name: `${st} Records`,
      url: q => `https://www.google.com/search?q=${enc(`${q.first} ${q.last} ${st} public records`)}`
    }))
  },
  {
    id: "leaks",
    label: "Data Leaks",
    icon: "🔓",
    sources: [
      { name: "Have I Been Pwned", url: q => `https://haveibeenpwned.com/account/${enc(q.email)}` },
