'use server';

/**
 * @fileOverview Personalized savings tips flow.
 *
 * This flow generates personalized savings tips based on the user's saving habits and goals.
 * It takes user's goals and contribution history as input and returns a personalized saving tip.
 *
 * @interface PersonalizedSavingsTipsInput - Input for the personalized savings tips flow.
 * @interface PersonalizedSavingsTipsOutput - Output for the personalized savings tips flow.
 * @function personalizedSavingsTips - The main function to generate personalized savings tips.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedSavingsTipsInputSchema = z.object({
  goals: z.array(
    z.object({
      name: z.string().describe('The name of the saving goal.'),
      emoji: z.string().describe('An emoji representing the goal.'),
      totalAmount: z.number().describe('The total amount needed for the goal.'),
      savedAmount: z.number().describe('The amount already saved for the goal.'),
      deadline: z.string().describe('The deadline for the goal (ISO format).'),
    })
  ).describe('The user saving goals.'),
  contributionHistory: z.array(
    z.object({
      goalName: z.string().describe('The name of the goal the contribution was made to.'),
      amount: z.number().describe('The amount of the contribution.'),
      date: z.string().describe('The date of the contribution (ISO format).'),
    })
  ).describe('The user contribution history.'),
});
export type PersonalizedSavingsTipsInput = z.infer<typeof PersonalizedSavingsTipsInputSchema>;

const PersonalizedSavingsTipsOutputSchema = z.object({
  tip: z.string().describe('A personalized saving tip for the user.'),
});
export type PersonalizedSavingsTipsOutput = z.infer<typeof PersonalizedSavingsTipsOutputSchema>;

export async function personalizedSavingsTips(
  input: PersonalizedSavingsTipsInput
): Promise<PersonalizedSavingsTipsOutput> {
  return personalizedSavingsTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedSavingsTipsPrompt',
  input: {schema: PersonalizedSavingsTipsInputSchema},
  output: {schema: PersonalizedSavingsTipsOutputSchema},
  prompt: `You are a personal finance advisor. Given the user's saving goals and contribution history, generate a personalized saving tip to help them stay motivated and find new ways to save.

Here are the user's saving goals:
{{#each goals}}
- {{emoji}} {{name}}: Total amount needed: {{totalAmount}}, Saved amount: {{savedAmount}}, Deadline: {{deadline}}
{{/each}}

Here is the user's contribution history:
{{#each contributionHistory}}
- Goal: {{goalName}}, Amount: {{amount}}, Date: {{date}}
{{/each}}

Based on this information, provide one personalized saving tip. The tip should be no more than 2 sentences long.
`,}
);

const personalizedSavingsTipsFlow = ai.defineFlow(
  {
    name: 'personalizedSavingsTipsFlow',
    inputSchema: PersonalizedSavingsTipsInputSchema,
    outputSchema: PersonalizedSavingsTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
