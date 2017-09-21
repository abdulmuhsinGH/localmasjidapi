const expect = require("expect");

const {isValidCoordinates} = require("../../utils/utils");




describe("Test all utility functions",()=>{
  it("should return true for valid coordinates",(done)=>{
    
    expect(isValidCoordinates(1,1))
      .toExist()
      done();

  });

  it("should return false for invalid longitude",(done)=>{
    
    expect(isValidCoordinates(-191,1))
      .toNotExist()
      done();
      
  });

  it("should return false for invalid latitude",(done)=>{
    
    expect(isValidCoordinates(1,91))
      .toNotExist()
      done();
      
  })
})