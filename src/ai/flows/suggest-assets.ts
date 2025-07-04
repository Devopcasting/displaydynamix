'use server';

/**
 * @fileOverview AI-powered content suggestion for the template editor.
 *
 * - suggestRelevantAssets - A function that suggests relevant images and videos for templates.
 * - SuggestAssetsInput - The input type for the suggestRelevantAssets function.
 * - SuggestAssetsOutput - The return type for the suggestRelevantAssets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAssetsInputSchema = z.object({
  templateContent: z
    .string()
    .describe('The content of the current template in the editor.'),
  assetType: z
    .enum(['image', 'video'])
    .describe('The type of asset to suggest (image or video).'),
  numSuggestions: z
    .number()
    .default(3)
    .describe('The number of asset suggestions to return.'),
});
export type SuggestAssetsInput = z.infer<typeof SuggestAssetsInputSchema>;

const SuggestAssetsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      url: z.string().describe('URL of the suggested asset.'),
      description: z.string().describe('Description of the suggested asset.'),
    })
  ).
describe('Array of suggested assets.')
});
export type SuggestAssetsOutput = z.infer<typeof SuggestAssetsOutputSchema>;

export async function suggestRelevantAssets(input: SuggestAssetsInput): Promise<SuggestAssetsOutput> {
  return suggestAssetsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAssetsPrompt',
  input: {schema: SuggestAssetsInputSchema},
  output: {schema: SuggestAssetsOutputSchema},
  prompt: `You are an AI assistant designed to provide suggestions for relevant images and videos to enhance template designs.

  Based on the following template content, suggest {{numSuggestions}} relevant {{assetType}} assets. Provide a URL and a brief description for each suggestion.

  Template Content: {{{templateContent}}}

  Format your response as a JSON array of objects with 'url' and 'description' fields.
  `,
});

const suggestAssetsFlow = ai.defineFlow(
  {
    name: 'suggestAssetsFlow',
    inputSchema: SuggestAssetsInputSchema,
    outputSchema: SuggestAssetsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
