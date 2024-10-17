export interface FriendInter {
    userId: string;
    friendId: string;
    status: string;
    createdAt: Date;
}

export interface User {
    age: string;
    id?: string;
    gender: string;
    lastSeen: Date;
    username: string;
    email: string;
    photoURL: string;
    status: string;
    friends: FriendInter[];
}