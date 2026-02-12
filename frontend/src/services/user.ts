type User = {
    firstName?: string;
    lastName?: string;
    email?: string;
    jobTitle?: string;
    mobilePhone?: string;
    streetAddress?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    photo?: string;
};

export const getUser = async (): Promise<User> => {
    const response = await fetch('/api/user');
    if (!response.ok) throw new Error('Failed to fetch user data'); 
    
    const data: User = await response.json();
    return data;
}