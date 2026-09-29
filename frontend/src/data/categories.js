export const categories = [
    { name: 'Namkeen', slug: 'namkeen', mark: 'N', tone: '#d9531e' },
    { name: 'Dry Fruits', slug: 'dry-fruits', mark: 'D', tone: '#8c5a2b' },
    { name: 'Biscuits', slug: 'biscuits', mark: 'B', tone: '#b86b28' },
    { name: 'Mukhwas', slug: 'mukhwas', mark: 'M', tone: '#39835b' },
    { name: 'Papad', slug: 'papad', mark: 'P', tone: '#6c7d3c' },
    { name: 'Achar', slug: 'achar', mark: 'A', tone: '#a84332' },
    { name: 'Masala', slug: 'masala', mark: 'M', tone: '#bc4c28' },
];

export const getCategoryBySlug = (slug) => categories.find((category) => category.slug === slug);