export const advertise = {
    name: 'advertise',
    title: 'Advertise',
    type: 'document',
    fields: [
        {
            name: 'adLogo',
            title: 'AdLogo',
            type: 'image',
            options: {
                hotspot: true
            }
        },
        {
            name: 'adUrl',
            title: 'AdUrl',
            type: 'string'
        },
        {
            name: 'deployNum',
            title: 'DeployNum',
            type: 'number'
        }
    ]
}