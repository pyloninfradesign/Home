import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

export interface ProjectMetadata {
  type: string
  area: string
  status: string
  services: string[]
}

export interface ProjectAsset {
  name: string
  url: string
}

export interface ProjectPhoto extends ProjectAsset {
  isHero?: boolean
}

export interface Project extends Record<string, unknown> {
  projectId?: string
  createdAt?: string
  updatedAt?: string
  featuredInHero?: boolean
  heroTitle?: string
  heroSubtitle?: string
  heroDetails?: string
  heroExcerpt?: string
  heroImage?: string
  projectDetails?: string
  photos?: ProjectPhoto[]
  plans?: ProjectAsset[]
  slug: string
  title: string
  location: string
  category: string
  filterCategory: string
  image: string
  description: string
  details: ProjectMetadata
  designIntent: string
  challenges: string
}

interface BaseProjectInput {
  featuredInHero: boolean
  providedProjectId?: string
  name: string
  overview: string
  designIntent: string
  challenges: string
  heroTitle: string
  heroSubtitle: string
  heroDetails: string
  location: string
  photos: File[]
  plans: File[]
}

interface CreateProjectInput extends BaseProjectInput {
  heroPhotoSource?: string
}

interface UpdateProjectInput extends BaseProjectInput {
  slug: string
  heroPhotoSource?: string
  removePhotoUrls: string[]
  removePlanUrls: string[]
}

interface StoredProjectsFile {
  projects: Project[]
  seedBootstrapped?: boolean
}

const PROJECTS_DATA_PATH = path.join(process.cwd(), 'data', 'projects.json')

const seedProjects: Project[] = [
  {
    projectId: 'SEED-20240222-000001',
    createdAt: '2024-02-22T00:00:01.000Z',
    featuredInHero: true,
    heroExcerpt:
      'A government-scale circuit house designed with structural clarity and civic presence.',
    heroImage: '/images/circuit-house.jpg',
    slug: 'circuit-house-phulbani',
    title: 'Circuit House',
    location: 'Phulbani, Odisha',
    category: 'Government / Architecture',
    filterCategory: 'Architecture',
    image: '/images/circuit-house.jpg',
    description:
      'A government-scale circuit house designed with structural clarity and civic presence. The project combines functional program requirements with a dignified architectural expression befitting its institutional purpose.',
    projectDetails:
      'A government-scale circuit house designed with structural clarity and civic presence. The project combines functional program requirements with a dignified architectural expression befitting its institutional purpose.',
    photos: [{ name: 'circuit-house.jpg', url: '/images/circuit-house.jpg', isHero: true }],
    plans: [],
    details: {
      type: 'Government / Institutional',
      area: '12,000 sq. ft.',
      status: 'Completed',
      services: ['Architectural Design', 'Structural Design', 'Project Management'],
    },
    designIntent:
      'To create a welcoming yet authoritative structure that serves as a hub for visiting dignitaries and officials, with emphasis on spatial efficiency and local material integration.',
    challenges:
      'Balancing the formality required of a government facility with the comfort expected of a guest house, while adhering to PWD standards and local climatic considerations.',
  },
  {
    projectId: 'SEED-20240222-000002',
    createdAt: '2024-02-22T00:00:02.000Z',
    featuredInHero: true,
    heroExcerpt:
      'A comprehensive institutional hostel with complete architectural narrative for 50 residents.',
    heroImage: '/images/hostel-kalahandi.jpg',
    slug: '50-bedded-hostel-kalahandi',
    title: '50-Bedded Hostel',
    location: 'Dumarpadar, Kalahandi',
    category: 'Institutional Architecture',
    filterCategory: 'Architecture',
    image: '/images/hostel-kalahandi.jpg',
    description:
      'A comprehensive institutional hostel with complete architectural narrative including elevations, plans, and spatial organization for 50 residents. Designed for durability and communal well-being.',
    projectDetails:
      'A comprehensive institutional hostel with complete architectural narrative including elevations, plans, and spatial organization for 50 residents. Designed for durability and communal well-being.',
    photos: [{ name: 'hostel-kalahandi.jpg', url: '/images/hostel-kalahandi.jpg', isHero: true }],
    plans: [],
    details: {
      type: 'Institutional',
      area: '18,500 sq. ft.',
      status: 'Completed',
      services: ['Architectural Design', 'Interior Design', 'Structural Design', 'Quantity Survey'],
    },
    designIntent:
      'To provide a comfortable, well-ventilated living environment that fosters community among residents while maintaining individual privacy and security.',
    challenges:
      'Designing cost-effective student housing that meets ventilation and natural lighting requirements in a rural setting, with sustainable material choices.',
  },
  {
    projectId: 'SEED-20240222-000003',
    createdAt: '2024-02-22T00:00:03.000Z',
    featuredInHero: true,
    heroExcerpt:
      'A landscape and urban design initiative to transform the approach road to Jharsuguda Airport.',
    heroImage: '/images/beautification-airport.jpg',
    slug: 'beautification-jharsuguda-airport',
    title: 'Beautification of Jharsuguda Airport Road',
    location: 'Jharsuguda, Odisha',
    category: 'Urban Design',
    filterCategory: 'Urban Design',
    image: '/images/beautification-airport.jpg',
    description:
      'A landscape and urban design initiative to transform the approach road to Jharsuguda Airport into a visually compelling, functional corridor with modern infrastructure and greenery.',
    projectDetails:
      'A landscape and urban design initiative to transform the approach road to Jharsuguda Airport into a visually compelling, functional corridor with modern infrastructure and greenery.',
    photos: [{ name: 'beautification-airport.jpg', url: '/images/beautification-airport.jpg', isHero: true }],
    plans: [],
    details: {
      type: 'Urban / Landscape Design',
      area: '3.2 km corridor',
      status: 'Completed',
      services: ['Architectural Design', 'Project Management'],
    },
    designIntent:
      "To create a memorable first impression of Jharsuguda through thoughtful landscaping, street furniture, and lighting that reflects the region's progressive vision.",
    challenges:
      'Working within existing road infrastructure constraints while introducing significant visual improvement, ensuring low-maintenance landscaping suitable for the local climate.',
  },
  {
    projectId: 'SEED-20240222-000004',
    createdAt: '2024-02-22T00:00:04.000Z',
    featuredInHero: false,
    slug: 'simplex-chandaka',
    title: 'Simplex, Chandaka',
    location: 'Chandaka, Bhubaneswar',
    category: 'Residential / Multi-unit',
    filterCategory: 'Residential',
    image: '/images/simplex-chandaka.jpg',
    description:
      'A detailed residential multi-unit development with carefully planned floor layouts optimizing space utilization and natural light penetration across all units.',
    projectDetails:
      'A detailed residential multi-unit development with carefully planned floor layouts optimizing space utilization and natural light penetration across all units.',
    photos: [{ name: 'simplex-chandaka.jpg', url: '/images/simplex-chandaka.jpg' }],
    plans: [],
    details: {
      type: 'Residential / Multi-unit',
      area: '8,200 sq. ft.',
      status: 'Completed',
      services: ['Architectural Design', 'Interior Design', 'Structural Design'],
    },
    designIntent:
      'To maximize livable space within a compact footprint while ensuring each unit receives adequate ventilation, natural light, and a sense of openness.',
    challenges:
      'Optimizing the site layout to accommodate multiple units without compromising on individual unit quality, parking, and common amenities.',
  },
  {
    projectId: 'SEED-20240222-000005',
    createdAt: '2024-02-22T00:00:05.000Z',
    featuredInHero: false,
    slug: 'staff-quarter-iffco-paradip',
    title: 'Staff Quarter, IFFCO',
    location: 'Paradip, Odisha',
    category: 'Residential',
    filterCategory: 'Residential',
    image: '/images/staff-quarter-iffco.jpg',
    description:
      'Functional residential quarters designed for IFFCO staff, emphasizing durability, climate responsiveness, and efficient layout planning for industrial township living.',
    projectDetails:
      'Functional residential quarters designed for IFFCO staff, emphasizing durability, climate responsiveness, and efficient layout planning for industrial township living.',
    photos: [{ name: 'staff-quarter-iffco.jpg', url: '/images/staff-quarter-iffco.jpg' }],
    plans: [],
    details: {
      type: 'Residential / Industrial Township',
      area: '6,400 sq. ft.',
      status: 'Completed',
      services: ['Architectural Design', 'Structural Design', 'Quantity Survey'],
    },
    designIntent:
      'To create comfortable, standardized living spaces that cater to the needs of industrial workers and their families, with emphasis on community spaces.',
    challenges:
      'Meeting industrial standards while creating warm, livable homes within budget constraints and tight construction timelines.',
  },
  {
    projectId: 'SEED-20240222-000006',
    createdAt: '2024-02-22T00:00:06.000Z',
    featuredInHero: false,
    slug: 'private-cottage-puri',
    title: 'Private Cottage',
    location: 'Puri, Odisha',
    category: 'Residential',
    filterCategory: 'Residential',
    image: '/images/cottage-puri.jpg',
    description:
      'A compact yet elegant private cottage in the coastal town of Puri. The design balances intimate residential scale with the openness demanded by its beachside setting.',
    projectDetails:
      'A compact yet elegant private cottage in the coastal town of Puri. The design balances intimate residential scale with the openness demanded by its beachside setting.',
    photos: [{ name: 'cottage-puri.jpg', url: '/images/cottage-puri.jpg' }],
    plans: [],
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
    projectId: 'SEED-20240222-000007',
    createdAt: '2024-02-22T00:00:07.000Z',
    featuredInHero: false,
    slug: 'beautification-sardega-railway',
    title: 'Beautification of Sardega Railway Siding',
    location: 'Sardega, MCL',
    category: 'Urban / Infrastructure',
    filterCategory: 'Urban Design',
    image: '/images/sardega-railway.jpg',
    description:
      'Site development and beautification of the Sardega Railway Siding for Mahanadi Coalfields Limited, transforming an industrial zone into a visually organized and functional space.',
    projectDetails:
      'Site development and beautification of the Sardega Railway Siding for Mahanadi Coalfields Limited, transforming an industrial zone into a visually organized and functional space.',
    photos: [{ name: 'sardega-railway.jpg', url: '/images/sardega-railway.jpg' }],
    plans: [],
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
    projectId: 'SEED-20240222-000008',
    createdAt: '2024-02-22T00:00:08.000Z',
    featuredInHero: false,
    slug: 'aiims-bhubaneswar-main-gate',
    title: 'AIIMS Bhubaneswar Main Gate',
    location: 'Bhubaneswar, Odisha',
    category: 'Institutional / Structural',
    filterCategory: 'Structural',
    image: '/images/aiims-gate.jpg',
    description:
      "A bold, contemporary gate structure for one of India's premier medical institutions. The design combines structural expressiveness with institutional gravitas.",
    projectDetails:
      "A bold, contemporary gate structure for one of India's premier medical institutions. The design combines structural expressiveness with institutional gravitas.",
    photos: [{ name: 'aiims-gate.jpg', url: '/images/aiims-gate.jpg' }],
    plans: [],
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function formatProjectId(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `PROJECT-${year}${month}${day}-${hours}${minutes}${seconds}`
}

function getExcerpt(details: string, maxLength: number) {
  const normalized = details.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength - 3).trimEnd()}...`
}

function isAllowedPhoto(file: File) {
  const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/gif'])
  const ext = path.extname(file.name).toLowerCase()
  return allowedTypes.has(file.type) || ['.jpg', '.jpeg', '.png', '.gif'].includes(ext)
}

function isAllowedPlan(file: File) {
  const ext = path.extname(file.name).toLowerCase()
  const allowedTypes = new Set([
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
  ])
  return allowedTypes.has(file.type) || ['.pdf', '.docx', '.doc', '.txt'].includes(ext)
}

function sanitizeFileName(fileName: string) {
  const extension = path.extname(fileName)
  const base = path.basename(fileName, extension)
  const safeBase = slugify(base) || 'file'
  return `${safeBase}${extension.toLowerCase()}`
}

async function ensureProjectsFile() {
  try {
    await readFile(PROJECTS_DATA_PATH, 'utf8')
  } catch {
    await mkdir(path.dirname(PROJECTS_DATA_PATH), { recursive: true })
    await writeFile(
      PROJECTS_DATA_PATH,
      JSON.stringify(
        { projects: seedProjects, seedBootstrapped: true } satisfies StoredProjectsFile,
        null,
        2
      ),
      'utf8'
    )
  }
}

function mergeSeedProjects(projects: Project[]) {
  return [
    ...projects,
    ...seedProjects.filter((seed) => !projects.some((project) => project.slug === seed.slug)),
  ]
}

async function loadStoredProjects(): Promise<Project[]> {
  await ensureProjectsFile()

  try {
    const raw = await readFile(PROJECTS_DATA_PATH, 'utf8')
    const parsed = JSON.parse(raw) as StoredProjectsFile
    const projects = Array.isArray(parsed.projects) ? parsed.projects : []
    if (parsed.seedBootstrapped) {
      return projects
    }

    const merged = mergeSeedProjects(projects)
    if (merged.length !== projects.length || !parsed.seedBootstrapped) {
      await saveStoredProjects(merged)
    }
    return merged
  } catch {
    return seedProjects
  }
}

async function saveStoredProjects(projects: Project[]) {
  await ensureProjectsFile()
  await writeFile(
    PROJECTS_DATA_PATH,
    JSON.stringify({ projects, seedBootstrapped: true } satisfies StoredProjectsFile, null, 2),
    'utf8'
  )
}

function validateCommonInput(input: BaseProjectInput) {
  const name = (input.name ?? '').trim()
  const location = (input.location ?? '').trim()
  const photos = input.photos.filter((file) => file.size > 0)
  const plans = input.plans.filter((file) => file.size > 0)

  if (!name) throw new Error('Project Name is required.')
  if (name.length > 100) throw new Error('Project Name must be 100 characters or fewer.')
  const overview = (input.overview ?? '').trim()
  const designIntent = (input.designIntent ?? '').trim()
  const challenges = (input.challenges ?? '').trim()
  const heroTitle = (input.heroTitle ?? '').trim()
  const heroSubtitle = (input.heroSubtitle ?? '').trim()
  const heroDetails = (input.heroDetails ?? '').trim()
  if (!overview) throw new Error('Project Overview is required.')
  if (overview.length < 200) throw new Error('Project Overview must be at least 200 characters long.')
  if (!designIntent) throw new Error('Design Intent is required.')
  if (!challenges) throw new Error('Challenges & Solutions are required.')
  if (!location) throw new Error('Project Location is required.')

  photos.forEach((file) => {
    if (!isAllowedPhoto(file)) throw new Error(`Unsupported photo format: ${file.name}`)
    if (file.size > 5 * 1024 * 1024) throw new Error(`Photo exceeds 5MB limit: ${file.name}`)
  })

  plans.forEach((file) => {
    if (!isAllowedPlan(file)) throw new Error(`Unsupported plan format: ${file.name}`)
  })

  return {
    name,
    overview,
    designIntent,
    challenges,
    heroTitle,
    heroSubtitle,
    heroDetails,
    location,
    photos,
    plans,
  }
}

async function saveUploadedFiles(
  slug: string,
  existingPhotos: ProjectPhoto[],
  existingPlans: ProjectAsset[],
  photos: File[],
  plans: File[]
) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects', slug)
  await mkdir(uploadDir, { recursive: true })

  const newPhotos: ProjectPhoto[] = []
  for (const [index, photo] of photos.entries()) {
    const fileName = `${String(existingPhotos.length + index + 1).padStart(2, '0')}-${sanitizeFileName(photo.name)}`
    await writeFile(path.join(uploadDir, fileName), Buffer.from(await photo.arrayBuffer()))
    newPhotos.push({ name: photo.name, url: `/uploads/projects/${slug}/${fileName}` })
  }

  const newPlans: ProjectAsset[] = []
  for (const [index, plan] of plans.entries()) {
    const fileName = `${String(existingPlans.length + index + 1).padStart(2, '0')}-${sanitizeFileName(plan.name)}`
    await writeFile(path.join(uploadDir, fileName), Buffer.from(await plan.arrayBuffer()))
    newPlans.push({ name: plan.name, url: `/uploads/projects/${slug}/${fileName}` })
  }

  return { newPhotos, newPlans }
}

function applyHeroSelection(
  allPhotos: ProjectPhoto[],
  heroPhotoSource: string | undefined,
  featuredInHero: boolean
) {
  if (featuredInHero) {
    if (!heroPhotoSource) {
      throw new Error('Hero Photo and Project Details are mandatory for featured projects.')
    }
    const heroUrl = heroPhotoSource.startsWith('existing:')
      ? heroPhotoSource.replace('existing:', '')
      : heroPhotoSource.startsWith('new:')
        ? allPhotos[Number(heroPhotoSource.replace('new:', ''))]?.url
        : undefined
    if (!heroUrl || !allPhotos.some((photo) => photo.url === heroUrl)) {
      throw new Error('Hero Photo and Project Details are mandatory for featured projects.')
    }
    return allPhotos.map((photo) => ({ ...photo, isHero: photo.url === heroUrl }))
  }

  return allPhotos.map((photo) => ({ ...photo, isHero: false }))
}

function makeProjectRecord(
  project: Project | undefined,
  input: {
    projectId: string
    slug: string
    name: string
    overview: string
    designIntent: string
    challenges: string
    heroTitle: string
    heroSubtitle: string
    heroDetails: string
    location: string
    featuredInHero: boolean
    photos: ProjectPhoto[]
    plans: ProjectAsset[]
  }
) {
  const heroImage = input.photos.find((photo) => photo.isHero)?.url
  const image = heroImage ?? input.photos[0]?.url ?? project?.image ?? '/placeholder.jpg'
  const now = new Date().toISOString()

  return {
    ...project,
    projectId: input.projectId,
    slug: input.slug,
    title: input.name,
    location: input.location,
    featuredInHero: input.featuredInHero,
    heroTitle: input.heroTitle,
    heroSubtitle: input.heroSubtitle,
    heroDetails: input.heroDetails,
    heroExcerpt: getExcerpt(input.heroDetails || input.overview, 100),
    heroImage,
    projectDetails: input.overview,
    photos: input.photos,
    plans: input.plans,
    image,
    description: input.overview,
    createdAt: project?.createdAt ?? now,
    updatedAt: now,
    category: project?.category ?? 'Architecture',
    filterCategory: project?.filterCategory ?? 'Architecture',
    details: project?.details ?? {
      type: 'Architecture Project',
      area: 'To be updated',
      status: 'New',
      services: [],
    },
    designIntent: input.designIntent,
    challenges: input.challenges,
  } satisfies Project
}

export async function getProjects() {
  const projects = await loadStoredProjects()
  return projects.sort((a, b) => {
    const aTime = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime()
    const bTime = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime()
    return bTime - aTime
  })
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects()
  return projects.find((project) => project.slug === slug)
}

export async function getFilterCategories() {
  const projects = await getProjects()
  return ['All', ...Array.from(new Set(projects.map((project) => project.filterCategory))).sort()]
}

export async function getHeroProjects(limit = 5) {
  const projects = await getProjects()
  const featured = projects.filter((project) => project.featuredInHero && project.heroImage)
  return (featured.length > 0 ? featured : projects.slice(0, 3)).slice(0, limit)
}

export async function getFeaturedProjects(limit = 3) {
  const projects = await getProjects()
  const featured = projects.filter((project) => project.featuredInHero)
  return (featured.length > 0 ? featured : projects).slice(0, limit)
}

export function createProjectIdPreview() {
  return formatProjectId()
}

export async function createProject(input: CreateProjectInput) {
  const {
    name,
    overview,
    designIntent,
    challenges,
    heroTitle,
    heroSubtitle,
    heroDetails,
    location,
    photos,
    plans,
  } = validateCommonInput(input)
  if (photos.length > 10) throw new Error('You can upload up to 10 project photos.')
  if (plans.length > 5) throw new Error('You can upload up to 5 project plans.')

  const projectId =
    input.providedProjectId && /^PROJECT-\d{8}-\d{6}$/.test(input.providedProjectId)
      ? input.providedProjectId
      : formatProjectId()

  const projects = await loadStoredProjects()
  if (projects.some((project) => project.projectId === projectId)) {
    throw new Error('Generated Project ID already exists. Please submit again.')
  }

  const slugBase = slugify(name) || projectId.toLowerCase()
  let slug = slugBase
  let counter = 2
  while (projects.some((project) => project.slug === slug)) {
    slug = `${slugBase}-${counter}`
    counter += 1
  }

  const uploads = await saveUploadedFiles(slug, [], [], photos, plans)
  const finalPhotos = applyHeroSelection(uploads.newPhotos, input.heroPhotoSource, input.featuredInHero)
  const newProject = makeProjectRecord(undefined, {
    projectId,
    slug,
    name,
    overview,
    designIntent,
    challenges,
    heroTitle,
    heroSubtitle,
    heroDetails,
    location,
    featuredInHero: input.featuredInHero,
    photos: finalPhotos,
    plans: uploads.newPlans,
  })

  await saveStoredProjects([newProject, ...projects])
  return newProject
}

export async function updateProject(input: UpdateProjectInput) {
  const projects = await loadStoredProjects()
  const existing = projects.find((project) => project.slug === input.slug)
  if (!existing) throw new Error('Project not found.')

  const {
    name,
    overview,
    designIntent,
    challenges,
    heroTitle,
    heroSubtitle,
    heroDetails,
    location,
    photos,
    plans,
  } = validateCommonInput(input)
  const keptPhotos = (existing.photos ?? []).filter(
    (photo) => !input.removePhotoUrls.includes(photo.url)
  )
  const keptPlans = (existing.plans ?? []).filter(
    (plan) => !input.removePlanUrls.includes(plan.url)
  )

  if (keptPhotos.length + photos.length > 10) throw new Error('You can upload up to 10 project photos.')
  if (keptPlans.length + plans.length > 5) throw new Error('You can upload up to 5 project plans.')

  const uploads = await saveUploadedFiles(existing.slug, keptPhotos, keptPlans, photos, plans)
  const mergedPhotos = [...keptPhotos, ...uploads.newPhotos]
  const finalPhotos = applyHeroSelection(mergedPhotos, input.heroPhotoSource, input.featuredInHero)
  const mergedPlans = [...keptPlans, ...uploads.newPlans]

  const updated = makeProjectRecord(existing, {
    projectId: existing.projectId ?? formatProjectId(),
    slug: existing.slug,
    name,
    overview,
    designIntent,
    challenges,
    heroTitle,
    heroSubtitle,
    heroDetails,
    location,
    featuredInHero: input.featuredInHero,
    photos: finalPhotos,
    plans: mergedPlans,
  })

  await saveStoredProjects(projects.map((project) => (project.slug === existing.slug ? updated : project)))
  return updated
}

export async function deleteProject(slug: string) {
  const projects = await loadStoredProjects()
  const existing = projects.find((project) => project.slug === slug)
  if (!existing) throw new Error('Project not found.')

  await saveStoredProjects(projects.filter((project) => project.slug !== slug))

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects', slug)
  await rm(uploadDir, { recursive: true, force: true })
}
