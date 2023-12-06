export type ProjectResource = {
    id?: string
    owner: string
    name: string
    description?: string
    startAt: Date
    endsAt: Date
    public?: boolean
    closed?: boolean
    updatedAt?: Date
}