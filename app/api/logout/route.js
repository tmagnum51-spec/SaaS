import { NextResponse } from 'next/server';

export async function POST(request) {
  // Crée une réponse de redirection vers la page de login
  const response = NextResponse.redirect(new URL('/login', request.url), {
    status: 303, // Code HTTP standard pour une redirection post-méthode
  });

  // Supprime le cookie "token" en écrasant sa valeur et en le périmant
  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0, // Expire immédiatement
  });

  return response;
}