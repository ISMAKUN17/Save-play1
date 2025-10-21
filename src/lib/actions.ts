'use server';

import { z } from 'zod';
import { personalizedSavingsTips } from '@/ai/flows/personalized-savings-tips';

// Note: This action now fetches data directly within the server environment.
// For a real app, you would need to implement user authentication for server actions
// to securely get data for the currently logged-in user.
// For now, this is a placeholder and will not work without that implementation.

export async function getPersonalizedTipAction() {
  try {
    // const goals = await data.getGoals();
    // const contributionHistory = await data.getContributions();
    
    // Placeholder data since we cannot get user-specific data securely on the server yet.
    const placeholderData = {
      goals: [{ name: "Viaje", emoji: "✈️", totalAmount: 1000, savedAmount: 200, deadline: "2024-12-31" }],
      contributionHistory: [{ goalName: "Viaje", amount: 50, date: "2024-05-15" }]
    };

    const aiResponse = await personalizedSavingsTips(placeholderData);
    return { tip: aiResponse.tip, error: null };
  } catch (e) {
    console.error(e);
    return { tip: null, error: 'No se pudo generar un consejo. Inténtalo de nuevo.' };
  }
}
