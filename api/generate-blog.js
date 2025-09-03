const jwt = require('jsonwebtoken');

// Simple blog generation endpoint for Vercel with auth
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check authentication
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    // Simple topic matching
    let result;
    
    if (topic.toLowerCase().includes('ipa')) {
      result = {
        title: 'Mesterskap i IPA-brygging - Fra bitter til balansert',
        summary: 'En dyptykk i kunsten å brygge IPA - fra humlevalg til perfekt bitterhet.',
        content: 'IPA har blitt synonymt med moderne øl-revolusjon, og som hjemmebryggere har vi en unik mulighet til å utforske denne stilen i dybden. Nøkkelen til en god IPA ligger i balansen mellom malt-søthet og humle-bitterhet.\n\nGjennom våre eksperimenter har vi funnet at timing av humletilsetning er kritisk. Sen humling gir aroma, tidlig humling gir bitterhet, og midt-humling gir balanse.\n\nMed vårt RAPT-utstyr kan vi nå overvåke fermentering nøye og sikre at gjærtemperaturen holder seg stabil rundt 18-20°C for optimal humlekarakter.\n\nVårt råd er å starte enkelt med single-hop IPA-er før dere beveger dere til mer komplekse humlekombinasjoner!'
      };
    } else if (topic.toLowerCase().includes('stout')) {
      result = {
        title: 'Stout-brygging - Mørkhet med karakter',
        summary: 'Teknikker for å brygge rike, komplekse stouts med perfekt balanse av røstede smaker.',
        content: 'Stout er øl-brygging på sitt mest utfordrende og givende. Den mørke, rike karakteren kommer fra nøye utvalgte røstede malter som gir kompleksitet uten bitterhet.\n\nVi har lært at malt-temperaturen er kritisk - for høy kan gi aske-smak, for lav gir ikke nok røst-karakter. Våre beste stouts kommer fra 60-65°C mashing.\n\nFermentering av stout krever tålmodighet. Vi bruker RAPT-sensorer for å overvåke den langsomme prosessen og sikre riktig gjær-helse gjennom hele fermenteringen.\n\nResultatet er øl med dybde og kompleksitet som rivaliserer kommersielle bryggerier!'
      };
    } else {
      result = {
        title: `Brygging og ${topic} - Hjemmebryggernes guide`,
        summary: 'En praktisk utforskning av bryggemetoder og teknikker for entusiastiske hjemmebryggere.',
        content: `Som hjemmebryggere i Prefab Brew Crew er vi alltid interessert i å utforske nye aspekter ved brygging, spesielt når det gjelder ${topic}. Dette er et område som har fanget vår oppmerksomhet og gitt oss mange spennende lærdommer.\n\nGjennom systematisk eksperimentering og nøye dokumentasjon har vi utviklet metoder som gir konsistente og deilige resultater. Hver batch lærer oss noe nytt om prosessen.\n\nVårt moderne utstyr, inkludert RAPT-sensorer, lar oss overvåke kritiske parametere i sanntid. Dette har revolusjonert måten vi brygger på og gitt oss mulighet til å gjøre presise justeringer underveis.\n\nVi deler gjerne våre erfaringer med bryggegemeenskapet og oppfordrer andre til å eksperimentere trygt med egne variasjoner!`
      };
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}