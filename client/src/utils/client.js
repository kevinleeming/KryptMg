import sanityClient from '@sanity/client';

// 'h4idd2qg', 'skfUSeMChYTtHDVGL2bIx2k6gZdSCrW9w95IvjxrsKHXdXKJ3sQ6kgq46vEqCUHCIZAakFLOaBMsa9vNfO8sElIiqo1RwMfAufPjcAdxjSqQ51HXxEttAoCVvLByDiBV0KtEkukVCLJPYs3KXZyQMoRyQsXF9Cg63b5FFBM4CrjK4d14nxHC'
export const sdbClient = sanityClient({
    projectId: 'h4idd2qg',
    dataset: 'production',
    apiVersion: 'v1',
    token: 'skfUSeMChYTtHDVGL2bIx2k6gZdSCrW9w95IvjxrsKHXdXKJ3sQ6kgq46vEqCUHCIZAakFLOaBMsa9vNfO8sElIiqo1RwMfAufPjcAdxjSqQ51HXxEttAoCVvLByDiBV0KtEkukVCLJPYs3KXZyQMoRyQsXF9Cg63b5FFBM4CrjK4d14nxHC',
    useCdn: false,
})