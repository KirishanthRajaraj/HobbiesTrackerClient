import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { use, useEffect, useState } from "react";
import * as AIClient from '../client/AI.tsx';
import type { Hobby } from "../interfaces/Hobby.tsx";
import * as HobbyClient from '../client/hobby.tsx';

function HobbyRecommendation() {
    const [googleAIRes, setGoogleAIRes] = useState('');
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [hobbies, setHobbies] = useState<Hobby[]>()

    useEffect(() => {
        getAllHobbies();
    }, []);

    const handleSendPrompt = async () => {
        try {
            setLoading(true);
            const response = await AIClient.getGoogleAIResponse(fullPrompt);
            console.log("AI Response:", response.data);
            setGoogleAIRes(response.data.candidates[0].content.parts[0].text);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setLoading(false);
        }
    };

    const getAllHobbies = async () => {
        try {
            HobbyClient.getAllHobbies().then((res) => {
                setHobbies(res.data);
            }).catch((err) => {
                console.error("Error fetching hobbies:", err);
            });
        } catch (error) {
            console.error("Error in getAllHobbies:", error);
        }
    }

    const fullPrompt = `The user wants help deciding which hobby to do now. Their current interest or situation is: "${prompt}".

Here are the hobbies the user has saved:
${hobbies?.map(hobby => {
        const categories = hobby.categories.map(c => c.name).join(', ') || 'None';
        const plusPoints = hobby.pluspoints.map(p => `+ ${p.text}`).join('\n') || 'None';
        const minusPoints = hobby.minuspoints.map(p => `- ${p.text}`).join('\n') || 'None';
        return `

Hobby: ${hobby.name}
Description: ${hobby.description || 'No description provided.'}
Interest Level: ${hobby.interestLevel ?? 'N/A'}
Effort Level: ${hobby.effortLevel ?? 'N/A'}
Categories: ${categories}
Positive Aspects:
${plusPoints}
Negative Aspects:
${minusPoints}`;
    }).join('\n\n')}

Considering the user's input, recommend **one** of these hobbies. 
Respond with:
- The name of the recommended hobby
- A short description
- Why it’s a good fit for the user right now

Only recommend one hobby, no lists or comparisons.`;

    return (
        <div style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
            <TextField onChange={(e) => setPrompt(e.target.value)}></TextField>
            <div>halalloooo</div>
            <Button className="bg-black!" variant='outlined' onClick={handleSendPrompt}>Send prompt</Button>
            {loading ? (<CircularProgress color="secondary" />) : (<Typography className="text-black" color="secondary">{googleAIRes}</Typography>)}
        </div>
    );
}

export default HobbyRecommendation