/*
SELECT array_agg(musicbrainz.tag.id)
FROM musicbrainz.tag
WHERE (musicbrainz.tag.name ILIKE '%pop%')

SELECT array_agg(musicbrainz.tag.id)
FROM musicbrainz.tag
WHERE (musicbrainz.tag.name ILIKE 'rap %'
OR musicbrainz.tag.name ILIKE '% rap %'
OR musicbrainz.tag.name ILIKE '% rap'
OR musicbrainz.tag.name ILIKE '%hip-hop%'
OR musicbrainz.tag.name ILIKE '%hip hop%'
OR musicbrainz.tag.name ILIKE '%hiphop%')

SELECT array_agg(musicbrainz.tag.id)
FROM musicbrainz.tag
WHERE (musicbrainz.tag.name ILIKE '%country%')

SELECT array_agg(musicbrainz.tag.id)
FROM musicbrainz.tag
WHERE (musicbrainz.tag.name ILIKE '%electro%'
OR musicbrainz.tag.name ILIKE '%house%'
OR musicbrainz.tag.name ILIKE '%trance%'
OR musicbrainz.tag.name ILIKE '%downtempo%'
OR musicbrainz.tag.name ILIKE '%ambient%'
OR musicbrainz.tag.name ILIKE '%drum and bass%')

SELECT array_agg(musicbrainz.tag.id)
FROM musicbrainz.tag
WHERE (musicbrainz.tag.name ILIKE '%r b%'
OR musicbrainz.tag.name ILIKE '%r&b%')

SELECT array_agg(musicbrainz.tag.id)
FROM musicbrainz.tag
WHERE (musicbrainz.tag.name ILIKE '%rock%')

SELECT array_agg(musicbrainz.tag.id)
FROM musicbrainz.tag
WHERE (musicbrainz.tag.name ILIKE '%soul%')

SELECT array_agg(musicbrainz.tag.id)
FROM musicbrainz.tag
WHERE (musicbrainz.tag.name ILIKE '%indie%')

SELECT array_agg(musicbrainz.tag.id)
FROM musicbrainz.tag
WHERE (musicbrainz.tag.name ILIKE '%folk%')

SELECT array_agg(musicbrainz.tag.id)
FROM musicbrainz.tag
WHERE (musicbrainz.tag.name ILIKE '%classical%')

SELECT array_agg(musicbrainz.tag.id)
FROM musicbrainz.tag
WHERE (musicbrainz.tag.name ILIKE '%jazz%')

SELECT array_agg(musicbrainz.tag.id)
FROM musicbrainz.tag
WHERE (musicbrainz.tag.name ILIKE '%metal%')

SELECT array_agg(musicbrainz.tag.id)
FROM musicbrainz.tag
WHERE (musicbrainz.tag.name ILIKE '%blues%')

SELECT array_agg(musicbrainz.tag.id)
FROM musicbrainz.tag
WHERE (musicbrainz.tag.name ILIKE '%alternative%'
OR musicbrainz.tag.name ILIKE '%punk%')

SELECT array_agg(musicbrainz.tag.id)
FROM musicbrainz.tag
WHERE (musicbrainz.tag.name ILIKE '%techno%')

SELECT array_agg(musicbrainz.tag.id)
FROM musicbrainz.tag
WHERE (musicbrainz.tag.name ILIKE '%production%')
*/

export const best2019Recordings = [
  2167671,
  2107788,
  2187624,
  2204973,
  2223359,
  2166134,
  2173784,
  2113958,
  2164006,
  2184258,
];
export const best2019RapRecordings = [
  2167671,
  2187624,
  2223359,
  2113958,
  2163782,
  2152422,
  2210764,
  2166722,
  2064027,
  2215049,
];

export const genreToTags: any = {
  Pop: [
    639,
    558,
    4474,
    4665,
    6156,
    6415,
    6416,
    21810,
    23069,
    23507,
    25574,
    1182,
    25576,
    1126,
    32870,
    741,
    2987,
    25547,
    23115,
    22086,
    32882,
    502,
    159,
    1100,
    25536,
    634,
    3178,
    1012,
    18,
    1218,
    4663,
    22660,
    339,
    1235,
    714,
    1211,
    32883,
    1091,
    32843,
    628,
    1233,
    19,
    6444,
    1060,
    32867,
    23092,
    25582,
    32856,
    1220,
    17,
    8637,
    25540,
    25546,
    5930,
    1148,
  ],
  'Hip-Hop': [
    1277,
    1204,
    2349,
    4667,
    5917,
    21179,
    21403,
    1182,
    150,
    235,
    2311,
    33012,
    1424,
    33010,
    6436,
    5935,
    553,
    32862,
    4872,
    25579,
    1175,
    6638,
    25591,
    25031,
    21077,
  ],
  Country: [1181, 1250, 3967, 29907, 6433, 21825, 304, 6423, 802, 719],
  'Dance / Electronic': [
    26125,
    333,
    1721,
    5918,
    5916,
    6101,
    23069,
    23409,
    4666,
    1086,
    206,
    33052,
    1030,
    12,
    11,
    32841,
    58,
    23662,
    523,
    5937,
    1090,
    559,
    634,
    1259,
    4478,
    33017,
    1390,
    1310,
    5986,
    23124,
    675,
    2488,
    10,
    6431,
    1281,
    1282,
    32881,
    77,
    33022,
    33019,
    32566,
    7301,
    26,
    4731,
    23379,
    5741,
    5938,
  ],
  'R&B': [4910, 6414, 21179, 22771, 22760, 475, 32845, 32868, 984, 25031],
  Rock: [
    53,
    187,
    660,
    1105,
    1017,
    1345,
    2349,
    4717,
    21810,
    22896,
    24735,
    29014,
    1243,
    1312,
    276,
    911,
    1168,
    133,
    2673,
    2987,
    7,
    23115,
    1123,
    32882,
    4312,
    782,
    518,
    712,
    25542,
    159,
    1331,
    715,
    1150,
    656,
    5914,
    32842,
    29,
    987,
    1096,
    16,
    93,
    937,
    1122,
    1164,
    1305,
    1370,
    343,
    284,
    4663,
    2027,
    271,
    719,
    4662,
    2594,
    25553,
    1091,
    1256,
    1056,
    25562,
    25549,
    1454,
    720,
    1253,
    23092,
    26980,
    25537,
    25540,
    1063,
    47,
    20,
    709,
  ],
  Soul: [4910, 1347, 6414, 473, 1208, 5911, 32845, 4668, 609, 8637],
  Indie: [1065, 25899, 537, 1012, 284, 4662],
  Folk: [
    1065,
    993,
    2450,
    2978,
    4458,
    6156,
    6412,
    7437,
    896,
    1657,
    1422,
    937,
    343,
    75,
    1120,
  ],
  Classical: [25270, 15, 32848, 1384, 5081],
  Jazz: [
    660,
    6420,
    1231,
    1299,
    1379,
    1347,
    4664,
    25263,
    1373,
    1207,
    1836,
    1119,
    1133,
    4031,
    1305,
    1242,
    1246,
    71,
    5913,
    1306,
  ],
  Metal: [
    1277,
    1129,
    1404,
    3542,
    25576,
    1074,
    68,
    896,
    91,
    2552,
    3295,
    80,
    147,
    43,
    149,
    94,
    504,
    31004,
    26994,
    129,
    349,
    25544,
    89,
    172,
    1223,
    1072,
    1104,
    92,
    830,
  ],
  Blues: [1250, 1252, 1169, 4664, 5912, 712, 1234, 32868, 2027, 1170, 127],
  Alternative: [
    1181,
    1204,
    2978,
    4456,
    4469,
    21080,
    4888,
    133,
    22893,
    4695,
    192,
    1100,
    743,
    32945,
    32921,
    88,
    4687,
    1211,
    1222,
    25553,
    564,
    25582,
    1220,
    25537,
    1058,
    1072,
    221,
    20,
  ],
  Techno: [5492, 33052, 545],
  'Production Music': [359],
};
