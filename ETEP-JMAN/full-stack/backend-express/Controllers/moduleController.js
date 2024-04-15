const Module = require("../Models/Module");
 
 
 exports.createModule = async(req,res) => {
    try {
        const moduleData = req.body.file.slice(0, req.body.file.length - 1);
        const audience = req.body.moduleType;
    
        // Map moduleData to align with the schema
        const cleansedData = moduleData.map((module) => ({
          name: module.moduleName,
          desc: module.description,
          topics: module.topics.split(", "),
          stDate: module.startDate,
          enDate: module.endDate,
          audience: audience,
        }));
    
        // Create the module document
        await Module.create(cleansedData);
    
        res.status(200).json({ message: "Module Created" });
      } catch (err) {
        console.error("Error creating module:", err);
        res.status(500).json({ message: "Internal Server error" });
      }
  }


exports.getModules = async(req, res) => {
    try{
        const modules = await Module.find({ audience: req.params.audience });
        res.status(200).json(modules);

    }catch(err){
        res.status(200).json({message: "Internal Server error"});

    }
}