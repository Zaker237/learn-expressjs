export type ProjectResource = {
    id?: string
    owner: string
    name: string
    description?: string
    startAt: string | Date
    endsAt: string | Date
    public?: boolean
    closed?: boolean
    githublink?: string
    updatedAt?: Date
}