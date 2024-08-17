const db = require('../config/database');
const { messages } = require('../db/schema');
const { sql, count, and, eq} = require('drizzle-orm');
const cloudinary = require("../config/cloudinaryConfig");

exports.getMessages = async (userId, contactId) => {
    return db.select()
        .from(messages)
        .where(sql`(${messages.senderId} = ${userId} AND ${messages.receiverId} = ${contactId}) OR (${messages.senderId} = ${contactId} AND ${messages.receiverId} = ${userId})`)
        .orderBy(sql`${messages.createdAt} ASC`)
        .limit(50);
};

exports.sendMessage = async (msgBody) => {
    const newMessage = await db.insert(messages)
        .values(msgBody)
        .returning();
    return newMessage[0];
};

exports.markMessageAsRead = async (senderId, receiverId) => {
    return db.update(messages)
        .set({ read: true })
        .where(sql`${messages.senderId} = ${senderId} AND ${messages.receiverId} = ${receiverId}`);
};

exports.getUnreadMessageCount = async (senderId, receiverId) => {
    const result = await db
        .select({ unreadCount: count() })
        .from(messages)
        .where(
            and(
                eq(messages.senderId, senderId),
                eq(messages.receiverId, receiverId),
                eq(messages.read, false)
            )
        );

    return result[0].unreadCount;
}

exports.uploadMedia = (fileBuffer, resourceType = 'auto') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: resourceType },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
}