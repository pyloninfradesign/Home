export interface Project {
  slug: string
  title: string
  location: string
  category: string
  filterCategory: string
  image: string
  description: string
  details: {
    type: string
    area: string
    status: string
    services: string[]
  }
  designIntent: string
  challenges: string
}

export const projects: Project[] = [
  {
    slug: 'circuit-house-phulbani',
    title: 'Circuit House',
    location: 'Phulbani, Odisha',
    category: 'Government / Architecture',
    filterCategory: 'Architecture',
    image: '/images/circuit-house.jpg',
    description:
      'A government-scale circuit house designed with structural clarity and civic presence. The project combines functional program requirements with a dignified architectural expression befitting its institutional purpose.',
    details: {
      type: 'Government / Institutional',
      area: '12,000 sq. ft.',
      status: 'Completed',
      services: [
        'Architectural Design',
        'Structural Design',
        'Project Management',
      ],
    },
    designIntent:
      'To create a welcoming yet authoritative structure that serves as a hub for visiting dignitaries and officials, with emphasis on spatial efficiency and local material integration.',
    challenges:
      'Balancing the formality required of a government facility with the comfort expected of a guest house, while adhering to PWD standards and local climatic considerations.',
  },
  {
    slug: '50-bedded-hostel-kalahandi',
    title: '50-Bedded Hostel',
    location: 'Dumarpadar, Kalahandi',
    category: 'Institutional Architecture',
    filterCategory: 'Architecture',
    image: '/images/hostel-kalahandi.jpg',
    description:
      'A comprehensive institutional hostel with complete architectural narrative including elevations, plans, and spatial organization for 50 residents. Designed for durability and communal well-being.',
    details: {
      type: 'Institutional',
      area: '18,500 sq. ft.',
      status: 'Completed',
      services: [
        'Architectural Design',
        'Interior Design',
        'Structural Design',
        'Quantity Survey',
      ],
    },
    designIntent:
      'To provide a comfortable, well-ventilated living environment that fosters community among residents while maintaining individual privacy and security.',
    challenges:
      'Designing cost-effective student housing that meets ventilation and natural lighting requirements in a rural setting, with sustainable material choices.',
  },
  {
    slug: 'beautification-jharsuguda-airport',
    title: 'Beautification of Jharsuguda Airport Road',
    location: 'Jharsuguda, Odisha',
    category: 'Urban Design',
    filterCategory: 'Urban Design',
    image: '/images/beautification-airport.jpg',
    description:
      'A landscape and urban design initiative to transform the approach road to Jharsuguda Airport into a visually compelling, functional corridor with modern infrastructure and greenery.',
    details: {
      type: 'Urban / Landscape Design',
      area: '3.2 km corridor',
      status: 'Completed',
      services: ['Architectural Design', 'Project Management'],
    },
    designIntent:
      'To create a memorable first impression of Jharsuguda through thoughtful landscaping, street furniture, and lighting that reflects the region\'s progressive vision.',
    challenges:
      'Working within existing road infrastructure constraints while introducing significant visual improvement, ensuring low-maintenance landscaping suitable for the local climate.',
  },
  {
    slug: 'simplex-chandaka',
    title: 'Simplex, Chandaka',
    location: 'Chandaka, Bhubaneswar',
    category: 'Residential / Multi-unit',
    filterCategory: 'Residential',
    image: '/images/simplex-chandaka.jpg',
    description:
      'A detailed residential multi-unit development with carefully planned floor layouts optimizing space utilization and natural light penetration across all units.',
    details: {
      type: 'Residential / Multi-unit',
      area: '8,200 sq. ft.',
      status: 'Completed',
      services: [
        'Architectural Design',
        'Interior Design',
        'Structural Design',
      ],
    },
    designIntent:
      'To maximize livable space within a compact footprint while ensuring each unit receives adequate ventilation, natural light, and a sense of openness.',
    challenges:
      'Optimizing the site layout to accommodate multiple units without compromising on individual unit quality, parking, and common amenities.',
  },
  {
    slug: 'staff-quarter-iffco-paradip',
    title: 'Staff Quarter, IFFCO',
    location: 'Paradip, Odisha',
    category: 'Residential',
    filterCategory: 'Residential',
    image: '/images/staff-quarter-iffco.jpg',
    description:
      'Functional residential quarters designed for IFFCO staff, emphasizing durability, climate responsiveness, and efficient layout planning for industrial township living.',
    details: {
      type: 'Residential / Industrial Township',
      area: '6,400 sq. ft.',
      status: 'Completed',
      services: [
        'Architectural Design',
        'Structural Design',
        'Quantity Survey',
      ],
    },
    designIntent:
      'To create comfortable, standardized living spaces that cater to the needs of industrial workers and their families, with emphasis on community spaces.',
    challenges:
      'Meeting industrial standards while creating warm, livable homes within budget constraints and tight construction timelines.',
  },
  {
    slug: 'private-cottage-puri',
    title: 'Private Cottage',
    location: 'Puri, Odisha',
    category: 'Residential',
    filterCategory: 'Residential',
    image: '/images/cottage-puri.jpg',
    description:
      'A compact yet elegant private cottage in the coastal town of Puri. The design balances intimate residential scale with the openness demanded by its beachside setting.',
    details: {
      type: 'Residential',
      area: '2,800 sq. ft.',
      status: 'Completed',
      services: ['Architectural Design', 'Interior Design'],
    },
    designIntent:
      'To create a serene retreat that connects the inhabitants with the coastal environment through strategic openings, natural materials, and indoor-outdoor flow.',
    challenges:
      'Designing for coastal climate conditions including salt-air corrosion, monsoon winds, and humidity, while maintaining an open, breezy aesthetic.',
  },
  {
    slug: 'beautification-sardega-railway',
    title: 'Beautification of Sardega Railway Siding',
    location: 'Sardega, MCL',
    category: 'Urban / Infrastructure',
    filterCategory: 'Urban Design',
    image: '/images/sardega-railway.jpg',
    description:
      'Site development and beautification of the Sardega Railway Siding for Mahanadi Coalfields Limited, transforming an industrial zone into a visually organized and functional space.',
    details: {
      type: 'Urban / Infrastructure',
      area: '2.5 acres',
      status: 'Completed',
      services: ['Architectural Design', 'Project Management'],
    },
    designIntent:
      'To reimagine an industrial railway siding as a well-organized space that balances operational efficiency with aesthetic improvement and environmental consideration.',
    challenges:
      'Working within active industrial operations while implementing significant visual and functional upgrades to the site.',
  },
  {
    slug: 'aiims-bhubaneswar-main-gate',
    title: 'AIIMS Bhubaneswar Main Gate',
    location: 'Bhubaneswar, Odisha',
    category: 'Institutional / Structural',
    filterCategory: 'Structural',
    image: '/images/aiims-gate.jpg',
    description:
      'A bold, contemporary gate structure for one of India\'s premier medical institutions. The design combines structural expressiveness with institutional gravitas.',
    details: {
      type: 'Institutional / Structural',
      area: 'N/A',
      status: 'Completed',
      services: ['Architectural Design', 'Structural Design'],
    },
    designIntent:
      'To create an iconic entry point that reflects the prestige and modernity of AIIMS while providing functional security and traffic management.',
    challenges:
      'Designing a structurally expressive gate that meets security requirements, manages high traffic volumes, and serves as a recognizable landmark.',
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getFilterCategories(): string[] {
  return [
    'All',
    'Architecture',
    'Residential',
    'Urban Design',
    'Structural',
  ]
}
