const express = require('express');
const Places = require('../models/places');
const Deals = require('../models/deals');
const PriorityQueue = require('./PriorityQueue')


const find_route = express.Router();

find_route.use(express.json());



var min_cost_graph=[];
var min_time_graph=[];

const findPlace = (value) => {
    return Places.find({name: value}).exec();
}


const createMinCostGraph= (deals,n)=>{

    deals.forEach(async (item)=>{

        let res = await findPlace(item.departure);
        let res2= await findPlace(item.arrival);
        let cost=item.cost*(100-item.discount)/100;

        if(min_cost_graph[res[0].id]){
            min_cost_graph[res[0].id].push([res2[0].id,cost,item.duration,item.transport])
        }
        else{
            min_cost_graph[res[0].id]=[];
            min_cost_graph[res[0].id].push([res2[0].id,cost,item.duration,item.transport])

        }

    })

}

const createMinTimeGraph= (deals,n)=>{

    deals.forEach(async (item)=>{

        let res = await findPlace(item.departure);
        let res2= await findPlace(item.arrival);
        let cost=item.cost*(100-item.discount)/100;

        if(min_time_graph[res[0].id]){
            min_time_graph[res[0].id].push([res2[0].id,item.duration,cost,item.transport])
        }
        else{
            min_time_graph[res[0].id]=[];
            min_time_graph[res[0].id].push([res2[0].id,item.duration,cost,item.transport])

        }

    })

}



Deals.find({},(err,res)=>{
    if(err)console.log(err)
    else{
        Places.countDocuments({},(err,res2)=>{
            if(err)console.log(err)
            else createMinCostGraph(res,res2);
        });
    }
})



Deals.find({},(err,res)=>{
    if(err)console.log(err)
    else{
        Places.countDocuments({},(err,res2)=>{
            if(err)console.log(err)
            else createMinTimeGraph(res,res2);
        });
    }
})



const find_cheapest_route=(i,j)=>{

    var vis=new Array(16).fill(0);

    var q= new PriorityQueue();

    q.enqueue([0,[i]],0);

    while(!q.isEmpty()){

        let t=q.front().element;

        if(vis[t[1][t[1].length-1]]===1){
            q.dequeue();
            continue;
        }

        if(t[1][t[1].length-1]===j){
            return {response:"true",type:"Cheapest",total:t[0],path:t[1]};
        }
        else{
        
            vis[t[1][t[1].length-1]]=1;
            q.dequeue();
             
            min_cost_graph[t[1][t[1].length-1]].forEach((nbr)=>{

                if(vis[nbr[0]]===0){
                    q.enqueue([t[0]+nbr[1],[...t[1],nbr[1],nbr[2],nbr[3],nbr[0]]],t[0]+nbr[1]);
                }   
                
            })
        }
    }

    return {response:"false"}

}


const find_fastest_route=(i,j)=>{

    var vis=new Array(16).fill(0);

    var q= new PriorityQueue();

    q.enqueue([0,[i]],0);

    while(!q.isEmpty()){

        let t=q.front().element;

        if(vis[t[1][t[1].length-1]]===1){
            q.dequeue();
            continue;
        }

        if(t[1][t[1].length-1]===j){
            return {response:"true",type:"Fastest",total:t[0],path:t[1]};
        }
        else{
        
            vis[t[1][t[1].length-1]]=1;
            q.dequeue();
             
            min_time_graph[t[1][t[1].length-1]].forEach((nbr)=>{

                if(vis[nbr[0]]===0){
                    q.enqueue([t[0]+nbr[1],[...t[1],nbr[1],nbr[2],nbr[3],nbr[0]]],t[0]+nbr[1]);
                }   
                
            })
        }
    }

    return {response:"false"}

}



find_route.route('/')
.get(async (req,res,next) => {

    let start= await findPlace(req.query.start);
    let end= await findPlace(req.query.end);

    if(req.query.cheap==="True"){
        result=find_cheapest_route(start[0].id,end[0].id);
    }
    else{
        result=find_fastest_route(start[0].id,end[0].id);
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(result);  
    
})


module.exports = find_route;