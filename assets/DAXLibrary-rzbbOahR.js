import{c as h,j as e,m as p,u as A,r as n}from"./index-BCdylXQj.js";import{C as T}from"./copy-CCeFQTC2.js";import{D as y}from"./database-DuMVr_Rg.js";const v=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],C=h("check",v);const D=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],f=h("search",D),c=({width:a="w-full",height:t="h-4",rounded:o="rounded",className:i="",animate:r=!0})=>e.jsx(p.div,{className:`${a} ${t} ${o} bg-slate-200 dark:bg-slate-700 ${i}`,animate:r?{opacity:[.5,1,.5]}:{},transition:{duration:1.5,repeat:1/0,ease:"easeInOut"}}),E=({lines:a=3,showAvatar:t=!1,className:o=""})=>e.jsxs("div",{className:`card p-4 space-y-3 ${o}`,children:[t&&e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(c,{width:"w-10",height:"h-10",rounded:"rounded-full"}),e.jsxs("div",{className:"flex-1 space-y-2",children:[e.jsx(c,{width:"w-1/3",height:"h-4"}),e.jsx(c,{width:"w-1/2",height:"h-3"})]})]}),e.jsx("div",{className:"space-y-2",children:Array.from({length:a},(i,r)=>e.jsx(c,{width:r===a-1?"w-3/4":"w-full"},r))})]}),N=({items:a=5,className:t=""})=>e.jsx("div",{className:`space-y-4 ${t}`,children:Array.from({length:a},(o,i)=>e.jsx(E,{lines:2,showAvatar:!1},i))}),u=(a,t)=>{if(!t||!a)return a;const o=new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");return a.split(o).map((r,d)=>o.test(r)?e.jsx("mark",{className:"bg-yellow-200 dark:bg-yellow-600 px-1 rounded",children:r},d):r)},w=[{id:101,title:"Engagement Rate",description:"Total engagements divided by total impressions.",code:`Engagement Rate = 
DIVIDE(
    [Total Engagements],
    [Total Impressions],
    0
)`,category:"Social Media"},{id:102,title:"Impressions Growth %",description:"Month-over-Month growth in impressions.",code:`Impressions MoM % = 
VAR CurrentImpressions = [Total Impressions]
VAR PreviousImpressions = CALCULATE([Total Impressions], DATEADD('Date'[Date], -1, MONTH))
RETURN
DIVIDE(CurrentImpressions - PreviousImpressions, PreviousImpressions)`,category:"Social Media"},{id:103,title:"Follower Net Growth",description:"New followers minus unfollows.",code:`Net Follower Growth = 
[New Followers] - [Unfollows]`,category:"Social Media"},{id:201,title:"Cycle Time (Days)",description:'Average days from "In Progress" to "Done".',code:`Avg Cycle Time = 
AVERAGEX(
    FILTER(
        'Jira Issues',
        'Jira Issues'[Status] = "Done" && NOT(ISBLANK('Jira Issues'[InProgressDate]))
    ),
    DATEDIFF('Jira Issues'[InProgressDate], 'Jira Issues'[ResolvedDate], DAY)
)`,category:"Jira Delivery"},{id:202,title:"Throughput (Issues per Sprint)",description:"Count of issues completed in the current sprint context.",code:`Throughput = 
CALCULATE(
    COUNTROWS('Jira Issues'),
    'Jira Issues'[Status] = "Done"
)`,category:"Jira Delivery"},{id:203,title:"SLA Adherence %",description:"Percentage of tickets resolved within the SLA limit.",code:`SLA Adherence % = 
VAR WithinSLA = CALCULATE(COUNTROWS('Jira Issues'), 'Jira Issues'[DaysToResolve] <= [SLA Target])
VAR TotalResolved = CALCULATE(COUNTROWS('Jira Issues'), 'Jira Issues'[Status] = "Done")
RETURN
DIVIDE(WithinSLA, TotalResolved, 0)`,category:"Jira Delivery"},{id:1,title:"Year-over-Year Growth",description:"Calculate the percentage growth compared to the same period last year.",code:`YoY Growth % = 
VAR CurrentValue = [Total Sales]
VAR PreviousValue = CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date]))
RETURN
DIVIDE(CurrentValue - PreviousValue, PreviousValue)`,category:"Time Intelligence"},{id:2,title:"Moving Average (3 Months)",description:"Calculate the average of the last 3 months.",code:`3M Moving Avg = 
AVERAGEX(
    DATESINPERIOD('Date'[Date], LASTDATE('Date'[Date]), -3, MONTH),
    [Total Sales]
)`,category:"Time Intelligence"},{id:5,title:"Dynamic Title",description:"Create a title that changes based on slicer selection.",code:`Dynamic Title = 
"Report for " & 
SELECTEDVALUE('Date'[Year], "All Years") & 
" - " & 
SELECTEDVALUE('Product'[Category], "All Categories")`,category:"String Manipulation"},{id:6,title:"Pareto Analysis (80/20)",description:"Calculate the cumulative percentage to identify top contributors.",code:`Pareto % = 
VAR TotalSales = CALCULATE([Total Sales], ALLSELECTED('Product'))
VAR CurrentSales = [Total Sales]
VAR CumulativeSales = 
    CALCULATE(
        [Total Sales],
        FILTER(
            ALLSELECTED('Product'),
            [Total Sales] >= CurrentSales
        )
    )
RETURN
DIVIDE(CumulativeSales, TotalSales)`,category:"Advanced Analytics"}],L=()=>{const{addToast:a}=A(),[t,o]=n.useState(""),[i,r]=n.useState(null),[d,g]=n.useState(!0);n.useEffect(()=>{const s=setTimeout(()=>g(!1),300);return()=>clearTimeout(s)},[]);const m=w.filter(s=>{const l=t.toLowerCase();return s.title.toLowerCase().includes(l)||s.description.toLowerCase().includes(l)||s.category.toLowerCase().includes(l)}),x=(s,l)=>{navigator.clipboard.writeText(s),r(l),a("DAX pattern copied to clipboard!","success"),setTimeout(()=>r(null),2e3)};return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold text-slate-900",children:"DAX Pattern Library"}),e.jsx("p",{className:"text-slate-600",children:"HHS & WebFirst approved metrics and patterns."})]}),e.jsxs("div",{className:"flex gap-3 w-full md:w-auto",children:[e.jsxs("div",{className:"relative flex-1 md:w-64",children:[e.jsx(f,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4"}),e.jsx("input",{type:"text",placeholder:"Search patterns...",className:"input-field pl-10",value:t,onChange:s=>o(s.target.value)})]}),e.jsx("button",{onClick:()=>a("Request submitted to Analytics Lead.","info"),className:"btn-secondary whitespace-nowrap",children:"Request Pattern"})]})]}),d?e.jsx(N,{items:6,className:"grid grid-cols-1 gap-6"}):m.length>0?e.jsx("div",{className:"grid grid-cols-1 gap-6",children:m.map(s=>e.jsxs(p.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"card group",children:[e.jsxs("div",{className:"flex justify-between items-start mb-4",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-3 mb-1",children:[e.jsx("h3",{className:"text-lg font-semibold text-brand-700",children:u(s.title,t)}),e.jsx("span",{className:"text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200",children:u(s.category,t)})]}),e.jsx("p",{className:"text-sm text-slate-600",children:u(s.description,t)})]}),e.jsx("button",{onClick:()=>x(s.code,s.id),className:"p-2 rounded-lg bg-slate-100 hover:bg-brand-600 text-slate-500 hover:text-white transition-colors duration-200",title:"Copy DAX",children:i===s.id?e.jsx(C,{className:"h-5 w-5"}):e.jsx(T,{className:"h-5 w-5"})})]}),e.jsx("div",{className:"relative",children:e.jsx("pre",{className:"bg-slate-50 p-4 rounded-lg overflow-x-auto text-sm font-mono text-slate-700 border border-slate-200",children:e.jsx("code",{children:s.code})})})]},s.id))}):e.jsxs("div",{className:"text-center py-12 text-slate-400",children:[e.jsx(y,{className:"h-12 w-12 mx-auto mb-3 opacity-20"}),e.jsxs("p",{children:["No patterns found for “",t,"”"]}),e.jsx("button",{onClick:()=>o(""),className:"text-brand-600 font-medium hover:underline mt-2",children:"Clear search"})]})]})};export{L as default};
