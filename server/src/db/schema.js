const { pgTable, serial, text, timestamp, boolean, integer } = require('drizzle-orm/pg-core');

const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow(),
});

const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    senderId: integer('sender_id').references(() => users.id),
    receiverId: integer('receiver_id').references(() => users.id),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    read: boolean('read').default(false),
});

const contacts = pgTable('contacts', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    contactId: integer('contact_id').references(() => users.id),
    archived: boolean('archived').default(false),
    blocked: boolean('blocked').default(false),
});


module.exports = { users, messages, contacts };