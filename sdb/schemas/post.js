export const post = {
    name: 'post',
    title: 'Post',
    type: 'document',
    fields: [
        {
            name: 'thumbsup',
            title: 'Thumbsup',
            type: 'number',
        },
        {
            name: 'author',
            title: 'Author',
            type: 'string',
        },
        {
            name: 'thumbsupAccount',
            title: 'ThumbsupAccount',
            type: 'array',
            of: [{type: 'account'}]
        }
    ]
}