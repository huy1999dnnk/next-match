import { TokenType } from "@prisma/client";
import { randomBytes } from "crypto";
import { prisma } from "./prisma";

export async function getTokenByEmail(email: string) {
    try {
        return prisma.token.findFirst({
            where: { email }
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}
export async function getTokenByToken(token: string) {
    try {
        return prisma.token.findFirst({
            where: { token }
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function generateToken(email: string, type: TokenType) {
    const token = randomBytes(48).toString('hex')
    const expired = new Date(Date.now() + 1000 * 60 * 60 * 24)

    const existingToken = await getTokenByEmail(email)

    if(existingToken) {
        await prisma.token.delete({
            where: {id: existingToken.id}
        })
    }

    return prisma.token.create({
        data: {
            email,
            token,
            expired,
            type
        }
    })
}