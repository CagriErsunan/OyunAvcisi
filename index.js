import bodyParser from "body-parser";
import express from "express";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

const exchangeRateAPI_KEY = "EXCHANGERATE_API_ANAHTARINIZI_GİRİN"; `https://v6.exchangerate-api.com/v6/${exchangeRateAPI_KEY}/latest/USD`

var config = {
    method: 'get',
  maxBodyLength: Infinity,
    url: 'https://www.cheapshark.com/api/1.0/games?title=batman',
    headers: { }
  };


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", (req,res)=>{
    res.render("index.ejs");
});

app.post("/game", async (req,res)=>{
    let searchedTitle = req.body.searchedGameTitle;
    try {
       const gameData = await axios.get(`https://www.cheapshark.com/api/1.0/games?title=${searchedTitle}`);
       ///////
       let resutltsList = [];
       resutltsList = gameData.data;

       let titleResult = resutltsList[0].external;
       let priceResult = resutltsList[0].cheapest;
       let dealID = resutltsList[0].cheapestDealID;
       let imageResult = resutltsList[0].thumb;
       let gameID = resutltsList[0].gameID;
       ///////

       const deals = await axios.get(`https://www.cheapshark.com/api/1.0/games?id=${gameID}`);
       let dealsList;
       dealsList = deals.data;
       

       

       const kurResult = await axios.get(`https://v6.exchangerate-api.com/v6/${exchangeRateAPI_KEY}/latest/USD`);
       let kur = kurResult.data.conversion_rates;
       //console.log(resutltsList); 

       const storesResult = await axios.get(`https://www.cheapshark.com/api/1.0/stores`);
       let stores = storesResult.data;
       let gameStores = []; 
       for (let index = 0; index < (dealsList.deals).length; index++) {
            stores.forEach(store => {
                if ((dealsList.deals)[index].storeID == store.storeID) {
                    gameStores[index] = store.storeName;
                }
            });
       };

       res.render("game.ejs", {
            GameTitle : titleResult,
            bestStore : gameStores[0],
            minfiyat : priceResult,
            imageURL : imageResult,
            gameDeals : dealsList.deals,
            price : kur.TRY,
            store : gameStores
        });
        console.log(dealsList.deals);
    } catch (error) {
        console.log(error.message);
        res.status(404);
    }
});







app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})







