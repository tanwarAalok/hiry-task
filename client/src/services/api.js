import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const loginUser = async (email, password) => {
    try {
        const response = await api.post(`/auth/login`, {email, password});
        return response.data;
    } catch (error) {
        console.error('Error login user:', error);
        throw error.response ? error.response.data : error.message;
    }
};

export const registerUser = async (body) => {
    try {
        const response = await api.post(`/auth/register`, body);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error.response ? error.response.data : error.message;
    }
};

export const getUserContacts = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const response = await api.get(`/contacts`, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching user contacts:', error);
        throw error;
    }
};

export const getNonContactUsers = async () => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const response = await api.get(`/contacts/all`, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getMessages = async (contactId) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const response = await api.get(`/messages/${contactId}`, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching messages', error);
        throw error;
    }
};

export const updateBlockStatus = async (contactId, blocked) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const response = await api.put(`/contacts/${contactId}/block`, { blocked }, config);
        return response.data;
    } catch (error) {
        console.error('Error updating block status', error);
        throw error;
    }
}

export const updateArchiveStatus = async (contactId, archived) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const response = await api.put(`/contacts/${contactId}/archive`, { archived }, config);
        return response.data;
    } catch (error) {
        console.error('Error updating block status', error);
        throw error;
    }
}

export const getContactById = async (contactId) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const response = await api.get(`/contacts/get/${contactId}`, config);
        return response.data;
    } catch (error) {
        console.error('Error updating block status', error);
        throw error;
    }
}

export const uploadMedia = async (formData) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        const response = await api.post(`/messages/upload`, formData, config);
        return response.data;
    } catch (error) {
        console.error('Error updating block status', error);
        throw error;
    }
}
