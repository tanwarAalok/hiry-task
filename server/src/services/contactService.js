const db = require('../config/database');
const { contacts, users, messages } = require('../db/schema');
const { sql, eq, and, desc} = require('drizzle-orm');

exports.getUserContacts = async (userId) => {
    return db.select({
        id: contacts.contactId,
        name: users.name,
        image: users.image,
        lastMessage: sql`(
      SELECT COALESCE(
        jsonb_build_object(
          'content', m.content,
          'senderName', u.name,
          'createdAt', m.created_at
        ),
        NULL
      )
      FROM messages m
      INNER JOIN users u ON m.sender_id = u.id
      WHERE (m.sender_id = ${contacts.contactId} AND m.receiver_id = ${userId})
         OR (m.sender_id = ${userId} AND m.receiver_id = ${contacts.contactId})
      ORDER BY m.created_at DESC
      LIMIT 1
    )`.as('lastMessage'),
        unreadCount: sql`COALESCE(
      (SELECT COUNT(*)
       FROM messages
       WHERE sender_id = ${contacts.contactId}
         AND receiver_id = ${userId}
         AND read = false),
      0
    )`.as('unreadCount'),
        archived: contacts.archived,
        blocked: contacts.blocked,
    })
        .from(contacts)
        .innerJoin(users, sql`${contacts.contactId} = ${users.id}`)
        .where(sql`${contacts.userId} = ${userId}`)
        .orderBy(sql`(
            SELECT m.created_at
            FROM messages m
            WHERE (m.sender_id = ${contacts.contactId} AND m.receiver_id = ${userId})
               OR (m.sender_id = ${userId} AND m.receiver_id = ${contacts.contactId})
            ORDER BY m.created_at DESC
            LIMIT 1
        )`);
};

exports.getNonContactUsers = async (userId) => {
    return db.select({
        id: users.id,
        name: users.name,
        image: users.image,
    })
        .from(users)
        .where(
            sql`${users.id} != ${userId} AND ${users.id} NOT IN (
            SELECT ${contacts.contactId} 
            FROM ${contacts} 
            WHERE ${contacts.userId} = ${userId}
        )`
        );
};


exports.isNewContact = async (userId, contactId) => {
    try {
        const existingContact = await db.select()
            .from(contacts)
            .where(
                and(
                    eq(contacts.userId, userId),
                    eq(contacts.contactId, contactId)
                )
            )
            .limit(1);

        return existingContact.length === 0;
    } catch (error) {
        console.error('Error in isNewContact:', error);
        throw error;
    }
};

exports.searchUsers = async (query, userId) => {
    return db.select({
        id: users.id,
        name: users.name,
        image: users.image,
    })
        .from(users)
        .where(sql`${users.id} != ${userId} AND ${users.name} ILIKE ${`%${query}%`}`);
};

exports.updateContactStatus = async (userId, contactId, status) => {
    return db.update(contacts)
        .set(status)
        .where(sql`${contacts.userId} = ${userId} AND ${contacts.contactId} = ${contactId}`);
};

exports.addContact = async (userId, contactId) => {
    const existingContact = await db.select()
        .from(contacts)
        .where(sql`${contacts.userId} = ${userId} AND ${contacts.contactId} = ${contactId}`)
        .limit(1);

    if (existingContact.length > 0) {
        throw new Error('Contact already exists');
    }

    return db.insert(contacts)
        .values({ userId, contactId })
        .returning();
};

exports.getContactById = async (userId, contactId) => {
    return db.select({
        id: contacts.contactId,
        name: users.name,
        image: users.image,
        lastMessage: sql`(
            SELECT COALESCE(
                jsonb_build_object(
                    'content', m.content,
                    'senderName', u.name,
                    'createdAt', m.created_at
                ),
                NULL
            )
            FROM messages m
            INNER JOIN users u ON m.sender_id = u.id
            WHERE (m.sender_id = ${contacts.contactId} AND m.receiver_id = ${userId})
               OR (m.sender_id = ${userId} AND m.receiver_id = ${contacts.contactId})
            ORDER BY m.created_at DESC
            LIMIT 1
        )`.as('lastMessage'),
        unreadCount: sql`COALESCE(
            (SELECT COUNT(*)
             FROM messages
             WHERE sender_id = ${contacts.contactId}
               AND receiver_id = ${userId}
               AND read = false),
            0
        )`.as('unreadCount'),
        archived: contacts.archived,
        blocked: contacts.blocked,
    })
        .from(contacts)
        .innerJoin(users, sql`${contacts.contactId} = ${users.id}`)
        .where(sql`${contacts.userId} = ${userId} AND ${contacts.contactId} = ${contactId}`)
        .limit(1); // Ensure it returns only one contact
};