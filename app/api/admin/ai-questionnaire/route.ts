import {NextRequest,NextResponse} from 'next/server';
import {z} from 'zod';
import {questionnaireSchema} from '../../../../lib/questionnaire';
export const dynamic='force-dynamic';
const input=z.object({objective:z.string().trim().min(20).max(3000),count:z.number().int().min(3).max(25)});
const draftSchema=z.object({questions:z.array(z.object({type:z.enum(['single','multiple','rating','text','number']),title:z.string().min(1).max(500),required:z.boolean(),options:z.array(z.string().min(1).max(200)).max(20).default([]),min:z.number().int().optional(),max:z.number().int().optional(),minLabel:z.string().max(100).optional(),maxLabel:z.string().max(100).optional()})).min(1).max(25)});
export async function POST(req:NextRequest){
 if(!process.env.ADMIN_SETUP_TOKEN||req.headers.get('x-admin-token')!==process.env.ADMIN_SETUP_TOKEN)return NextResponse.json({error:'Unauthorized'},{status:401});
 if(!process.env.OPENAI_API_KEY)return NextResponse.json({error:'Configure OPENAI_API_KEY in Vercel server environment'},{status:503});
 try{
  const {objective,count}=input.parse(await req.json());
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),25000);
  let response:Response;
  try{response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',signal:controller.signal,headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',temperature:0.3,response_format:{type:'json_object'},messages:[{role:'system',content:'You are a senior quantitative market researcher. Return ONLY JSON {"questions":[{"type":"rating|single|multiple|text|number","title":"...","required":true,"options":["..."],"min":1,"max":5,"minLabel":"...","maxLabel":"..."}]}. Produce a neutral, non-leading, logically ordered consumer survey. For single/multiple provide 2-12 mutually comprehensible options. For rating set integer min/max and endpoint labels. For text and number options must be []. Avoid collecting sensitive personal information. Do not invent research results. No branching. Respond in English. CRITICAL: For monadic packaging studies, each respondent sees exactly ONE randomly assigned pack. Generate ONE COMMON set of pack-neutral questions using wording like this pack or the pack shown. NEVER create separate Current Pack and Test Pack questions or duplicate KPIs by cell. Respondents must never be asked to evaluate a pack they did not see.'},{role:'user',content:`Draft exactly ${count} survey questions for this research brief: ${objective}`} ]})});}finally{clearTimeout(timeout)}
  if(!response.ok)return NextResponse.json({error:'AI provider request failed. Check API key, model and billing.'},{status:502});
  const result=await response.json();const raw=result?.choices?.[0]?.message?.content;if(typeof raw!=='string')throw Error('Empty AI response');
  const parsed=draftSchema.parse(JSON.parse(raw));
  const questions=parsed.questions.map(q=>({id:crypto.randomUUID(),type:q.type,title:q.title,required:q.required,options:q.options.map(label=>({id:crypto.randomUUID(),label})),...(q.type==='rating'||q.type==='number'?{min:q.min??1,max:q.max??5}:{}),...(q.type==='rating'?{minLabel:q.minLabel||'Low',maxLabel:q.maxLabel||'High'}:{})}));
  const validated=questionnaireSchema.parse({questions});return NextResponse.json({draft:validated});
 }catch(e){return NextResponse.json({error:e instanceof z.ZodError?'AI draft failed questionnaire validation. Try a clearer brief.':'Could not generate a valid questionnaire. Try again.'},{status:422})}
}
