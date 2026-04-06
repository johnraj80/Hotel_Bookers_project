// GET /api/user/

export const getUserData = async (req, res) => {
    try {
        // req.user is already populated by your protect middleware
        const user = req.user; 

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Wrap the user object so it matches what AppContext expects
        res.json({ 
            success: true, 
            user: user 
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const storeRecentSearchedCities = async (req, res)=>{
    try {
        const {recentSearchedCity} = req.body;
        const user = await req.user;

        if(user.recentSearchedCities.length < 3){
            user.recentSearchedCities.push(recentSearchedCity)
        }else{
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedCity)
        }
        await user.save();
        res.json({success: true, message: "City added"})
        
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}