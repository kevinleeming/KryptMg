export const user = {
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
        },
        {
            name: 'followers',
            title: 'Followers',
            type: 'array',
            of: [{type: 'account'}]
        },
        {
            name: 'subscribes',
            title: 'subscribes',
            type: 'array',
            of: [{type: 'account'}]
        }, 
        {
            name: 'postNum',
            title: 'PostNum',
            type: 'number'
        }
    ]
}