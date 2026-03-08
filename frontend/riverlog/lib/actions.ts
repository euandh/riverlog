'use server';

import pb from '@/lib/pocketbase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// --- NEW AUTHENTICATION ACTION ---
export async function loginAdmin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    // 1. Ask PocketBase if these credentials are valid
    const authData = await pb.admins.authWithPassword(email, password);
    
    // 2. If valid, grab an encrypted cookie and attach the token
    const cookieStore = await cookies();
    cookieStore.set('pb_auth', authData.token, {
      httpOnly: true, // Prevents hackers from stealing it with JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // Stays logged in for 1 week
    });
  } catch (error) {
    // 3. If it fails, instantly kick them back to login with an error
    redirect('/login?error=true');
  }

  // 4. Success! Send them to the dashboard
  redirect('/dashboard');
}

// --- HELPER TO SECURE OUR FORMS ---
async function loadAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('pb_auth')?.value;
  if (token) {
    pb.authStore.save(token, null); // Tells PocketBase "I am the admin"
  }
}

// --- EXISTING ACTIONS (NOW SECURED) ---
export async function createTripReport(formData: FormData) {
  await loadAuth(); // <-- This runs before every database call!
  
  const sectionId = formData.get('sectionId') as string;
  const waterLevel = formData.get('water_level');
  const date = formData.get('date');
  const log = formData.get('log');

  const formattedLog = `<p>${log}</p>`; 
  const formattedDate = new Date(date as string).toISOString(); 

  await pb.collection('notes').create({
    section: sectionId,
    water_level: Number(waterLevel),
    date: formattedDate,
    log: formattedLog,
  });

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function createRiver(formData: FormData) {
  await loadAuth();
  const name = formData.get('name') as string;
  const region = formData.get('region') as string;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  await pb.collection('rivers').create({ name, region, slug });

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function createSection(formData: FormData) {
  await loadAuth();
  const riverId = formData.get('riverId') as string;
  const name = formData.get('name') as string;
  const grade = formData.get('grade') as string;
  const description = formData.get('description') as string;
  
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const formattedDescription = `<p>${description}</p>`; 

  await pb.collection('sections').create({
    river: riverId, name, grade, description: formattedDescription, slug,
  });

  revalidatePath('/dashboard');
  redirect('/dashboard');
}