let condition = {
    one_value : (value1) => {
        if (value1 !== undefined ){
            if (value1 !== "" ){
                return true
            } else{
                return false
            }
        } else {
            return false;
        }
    },
    two_values : (value1,value2) => {
        if (value1 !== undefined && value2 !== undefined){
            if (value1 !== "" && value2 !== ""){
                return true
            } else{
                return false
            }
        } else {
            return false;
        }
    },
    three_values : (value1,value2,value3) => {
        if (value1 !== undefined && value2 !== undefined && value3 !== undefined){
            if (value1 !== "" && value2 !== "" && value3 !== ""){
                return true
            } else{
                return false
            }
        } else {
            return false;
        }
    },
}

export default condition