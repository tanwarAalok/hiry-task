const contactService = require('../services/contactService');

exports.getContacts = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const contacts = await contactService.getUserContacts(userId);
        res.json(contacts);
    } catch (error) {
        next(error);
    }
};

exports.getContactById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const {contactId} = req.params;
        const contact = await contactService.getContactById(userId, contactId);
        res.json(contact[0]);
    } catch (error) {
        next(error);
    }
};

exports.getNonContactUsers = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const users = await contactService.getNonContactUsers(userId);
        res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.searchUsers = async (req, res, next) => {
    try {
        const { query } = req.query;
        const userId = req.user.id;
        const users = await contactService.searchUsers(query, userId);
        res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.updateContactStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { contactId } = req.params;
        const { archived, blocked } = req.body;
        await contactService.updateContactStatus(userId, contactId, { archived, blocked });
        res.json({ message: 'Contact updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.addContact = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { contactId } = req.body;
        const newContact = await contactService.addContact(userId, contactId);
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
};