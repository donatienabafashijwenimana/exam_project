const votingData = {

  posts: [
    { id: "p01", title: "Village Leader Election", location: "Gasabo", status: "active" },
    { id: "p02", title: "Community Services Poll", location: "Nyarugenge", status: "active" },
    { id: "p03", title: "Cooperative President Election", location: "Muhanga", status: "closed" }
  ],

  candidates: [
    // candidates for post p01
    { id: "c01", postId: "p01", name: "Bizimana Théodore", votes: 18 },
    { id: "c02", postId: "p01", name: "Nshimiyimana Eric", votes: 7 },

    // candidates for post p02
    { id: "c03", postId: "p02", name: "MWISENEZA Emmy", votes: 30 },
    { id: "c04", postId: "p02", name: "mbanzarugamba Cyprien", votes: 22 },
    { id: "c05", postId: "p02", name: "BICAMUMPAKA Emanuel", votes: 15 },

    // candidates for post p03
    { id: "c06", postId: "p03", name: "Mukamurenzi Diane", votes: 41 },
    { id: "c07", postId: "p03", name: "Ndayambaje Faustin", votes: 29 },
    { id: "c08", postId: "p03", name: "Tuyisenge Odette", votes: 17 }
  ],

  voters: [
  { id: "v01", name: "Uwimana Grace", district: "Gasabo", hasVoted: true, postId: "p01", candidateId: "c01" },
  { id: "v02", name: "Nkurunziza Jean", district: "Nyarugenge", hasVoted: true, postId: "p01", candidateId: "c02" },
  { id: "v03", name: "Mukamana Vestine", district: "Kicukiro", hasVoted: false, postId: null, candidateId: null },
  { id: "v04", name: "Habimana Patrick", district: "Huye", hasVoted: false, postId: null, candidateId: null },
  { id: "v05", name: "Nyiransabimana Cecile", district: "Musanze", hasVoted: true, postId: "p02", candidateId: "c03" },
  { id: "v06", name: "Bizimana Theodore", district: "Rubavu", hasVoted: true, postId: "p03", candidateId: "c06" },
  { id: "v07", name: "Uwizeyimana Solange", district: "Rwamagana", hasVoted: true, postId: "p02", candidateId: "c04" },
  { id: "v08", name: "Nshimiyimana Eric", district: "Nyagatare", hasVoted: true, postId: "p01", candidateId: "c01" },
  { id: "v09", name: "Mukamurenzi Diane", district: "Karongi", hasVoted: false, postId: null, candidateId: null },
  { id: "v10", name: "Ndayambaje Faustin", district: "Muhanga", hasVoted: true, postId: "p03", candidateId: "c07" },

  { id: "v11", name: "Tuyisenge Odette", district: "Ngororero", hasVoted: true, postId: "p01", candidateId: "c02" },
  { id: "v12", name: "Hakizimana Innocent", district: "Rulindo", hasVoted: false, postId: null, candidateId: null },
  { id: "v13", name: "Umutoniwase Amelie", district: "Bugesera", hasVoted: true, postId: "p02", candidateId: "c05" },
  { id: "v14", name: "Niyonzima Claude", district: "Gisagara", hasVoted: false, postId: null, candidateId: null },
  { id: "v15", name: "Mutuyimana Yvette", district: "Kayonza", hasVoted: true, postId: "p03", candidateId: "c06" },
  { id: "v16", name: "Nsengimana Alexis", district: "Kirehe", hasVoted: true, postId: "p01", candidateId: "c01" },
  { id: "v17", name: "Uwamahoro Josiane", district: "Nyanza", hasVoted: false, postId: null, candidateId: null },
  { id: "v18", name: "Habyarimana Leon", district: "Gakenke", hasVoted: true, postId: "p02", candidateId: "c04" },
  { id: "v19", name: "Nyiraminani Esperance", district: "Gicumbi", hasVoted: true, postId: "p02", candidateId: "c03" },
  { id: "v20", name: "Rukundo Emmanuel", district: "Rutsiro", hasVoted: false, postId: null, candidateId: null },

  { id: "v21", name: "Ingabire Clarisse", district: "Gasabo", hasVoted: true, postId: "p03", candidateId: "c08" },
  { id: "v22", name: "Nzeyimana Bonaventure", district: "Nyarugenge", hasVoted: true, postId: "p02", candidateId: "c05" },
  { id: "v23", name: "Kayitesi Annonciate", district: "Kicukiro", hasVoted: false, postId: null, candidateId: null },
  { id: "v24", name: "Sebazungu Prosper", district: "Huye", hasVoted: true, postId: "p02", candidateId: "c03" },
  { id: "v25", name: "Uwineza Laurence", district: "Musanze", hasVoted: true, postId: "p01", candidateId: "c02" },
  { id: "v26", name: "Manirakiza Patrick", district: "Gasabo", hasVoted: true, postId: "p01", candidateId: "c01" },
  { id: "v27", name: "Mukeshimana Alice", district: "Rwamagana", hasVoted: false, postId: null, candidateId: null },
  { id: "v28", name: "Habiyambere Jean", district: "Muhanga", hasVoted: true, postId: "p03", candidateId: "c07" },
  { id: "v29", name: "Uwayezu Claudine", district: "Rubavu", hasVoted: true, postId: "p02", candidateId: "c04" },
  { id: "v30", name: "Nsabimana David", district: "Nyagatare", hasVoted: false, postId: null, candidateId: null }
]

};

export default votingData;