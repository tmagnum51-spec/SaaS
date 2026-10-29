import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Appel vers le backend 
    const backendResponse = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    // 2. Gestion des erreurs renvoyées par le backend 
    if (!backendResponse.ok || !data.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Identifiants invalides',
          error: data.error 
        },
        { status: backendResponse.status || 401 }
      );
    }

    // 3. Récupération du token depuis l'API
    const token = data.data.token;

    // 4. Création de la réponse et stockage du token dans un Cookie HttpOnly sécurisé
    const response = NextResponse.json({ 
      success: true, 
      user: data.data.user 
    });

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true, // Empêche le JS côté client de lire le token (Anti-XSS)
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erreur de connexion au serveur' },
      { status: 500 }
    );
  }
}