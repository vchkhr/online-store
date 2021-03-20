let history = document.querySelector("div#calc div#out input#history")
let expression = document.querySelector("div#calc div#out input#expression")

class Calc {
    constructor(str) {
        this.reset(str)
        this.mode = "dec"
        this.unitFrom = ""
        this.unitTo = ""
    }

    reset(str = "0") {
        this.history = ""
        this.str = str
        this.mem = "0"

        this.updateInput()
    }

    updateInput(string = null) {
        history.value = this.history
        expression.value = this.str
    }

    calculate(answer = null) {
        this.str = expression.value

        if (this.str[0] == "0" && this.str[1] != ".") {
            this.str = this.str.slice(1)
        }

        this.history = this.str

        if (!answer) {
            try {
                this.str = Math.round((eval(this.str.toString().replace("÷", "/").replace("^", "**")) + Number.EPSILON) * 1000) / 1000
            }
            catch {
                this.str = "Error"
            }
        }
        else {
            this.str = answer
        }

        this.updateInput(this.str)
    }

    press(button) {
        if (button == "=") {
            if (this.mode == "hex") {
                let str1 = this.str.split(" ")[0]
                let str2 = this.str.split(" ")[this.str.split(" ").length - 1]

                this.history = this.str

                try {
                    this.str = this.toHexadecimal(eval(`${this.toDecimalHexadecimal(str1)} ${this.str.split(" ")[1]} ${this.toDecimalHexadecimal(str2)}`))
                }
                catch {
                    this.str = "Error"
                }

                this.updateInput()
            }
            else if (this.mode == "bin") {
                let str1 = this.str.split(" ")[0]
                let str2 = this.str.split(" ")[this.str.split(" ").length - 1]

                this.history = this.str

                console.log(eval(`${this.toDecimalBinary(str1)} ${this.str.split(" ")[1]} ${this.toDecimalBinary(str2)}`))

                try {
                    this.str = this.toBinary(eval(`${this.toDecimalBinary(str1)} ${this.str.split(" ")[1]} ${this.toDecimalBinary(str2)}`))
                }
                catch {
                    this.str = "Error"
                }

                this.updateInput()
            }
            else if (this.mode == "length") {
                let res = +this.str

                console.log(this.unitFrom, this.unitTo)

                if (this.unitFrom == "MM") {
                    res *= 0.001
                } else if (this.unitFrom == "CM") {
                    res *= 0.01
                } else if (this.unitFrom == "KM") {
                    res *= 1000
                }

                if (this.unitTo == "MM") {
                    res *= 1000
                } else if (this.unitTo == "CM") {
                    res *= 100
                } else if (this.unitTo == "KM") {
                    res *= 0.001
                }

                this.history = this.str
                this.str = res

                this.updateInput()
            }
            else if (this.mode == "weight") {
                let res = +this.str

                console.log(this.unitFrom, this.unitTo)

                if (this.unitFrom == "MG") {
                    res *= 0.001
                } else if (this.unitFrom == "KG") {
                    res *= 1000
                } else if (this.unitFrom == "T") {
                    res *= 1000000
                }

                if (this.unitTo == "MG") {
                    res *= 1000
                } else if (this.unitTo == "KG") {
                    res *= 0.001
                } else if (this.unitTo == "T") {
                    res *= 0.000001
                }

                this.history = this.str
                this.str = res

                this.updateInput()
            }
            else if (this.mode == "area") {
                let res = +this.str

                console.log(this.unitFrom, this.unitTo)
                console.log(res)

                if (this.unitFrom == "CM2") {
                    res *= 0.0001
                } else if (this.unitFrom == "KM2") {
                    res *= 0.0000000001
                } else if (this.unitFrom == "H") {
                    res *= 0.00000001
                }

                if (this.unitTo == "CM2") {
                    res *= 10000
                } else if (this.unitTo == "KM2") {
                    res *= 0.000001
                } else if (this.unitTo == "H") {
                    res *= 0.0001
                }

                this.history = this.str
                this.str = res

                this.updateInput()
            }
            else {
                this.calculate()
            }
        }
        else if (button == "AC") {
            this.str = "0"
        }
        else if (button == "%") {
            this.calculate(this.str / 100)
        }
        else if (button == "+/-") {
            let operands = this.str.split(" ")
            let lastOperand = operands[operands.length - 1]

            if (lastOperand[0] == "-") {
                lastOperand = lastOperand.substring(1);
            } else {
                lastOperand = "-" + lastOperand
            }

            this.str = operands.slice(0, -1).join(" ") + " " + lastOperand
        }
        else if (button == "x!") {
            this.calculate()

            let res = 1

            for (let i = this.str; i >= 1; i--) {
                res *= i
            }

            this.str = res
        }
        else if (button == "x\u{207F}") {
            this.str += " " + "^" + " "
        }
        else if (button == "\u{221A}x") {
            this.calculate()

            this.str = Math.sqrt(this.str)
        }
        else if (button == "MC") {
            this.mem = "0"
        }
        else if (button == "MR") {
            this.mem = this.str
        }
        else if (button == "M+") {
            this.calculate()
            this.str += +this.mem
        }
        else if (button == "M-") {
            this.calculate()
            this.str -= this.mem
        }
        else if (!isNaN(button) || button == ".") {
            if (this.str == "0") {
                this.str = ""
            }

            if (button == ".") {
                let operands = this.str.split(" ")
                let lastOperand = operands[operands.length - 1]

                if (!lastOperand.includes(".")) {
                    if (lastOperand.length == 0) {
                        lastOperand = "0"
                    }

                    this.str = operands.slice(0, -1).join(" ") + " " + lastOperand
                    this.str += button
                }
            }
            else {
                this.str += button
            }
        }
        else if (button == "\u{03C0}") {
            this.str += "3.14159265"
        }
        else if (button == "e") {
            this.str += "2.71828"
        }
        else if (button == "\u{221A}2") {
            this.str += "1.41421356"
        }
        else if (button == "X\u{00B2}") {
            this.str += " ^ 2"
        }
        else if (button == "1/X") {
            this.str = "1 / " + this.str
        }
        else {
            if (this.mode == "hex") {
                if (button == "A" || button == "B" || button == "C" || button == "D" || button == "E" || button == "F") {
                    this.str += button
                }
                else {
                    this.str += " " + button + " "
                }
            }
            else if (this.mode == "length" || this.mode == "weight" || this.mode == "area") {
                if (!isNaN(button)) {
                    this.str += button
                }
            }
            else {
                this.str += " " + button + " "
            }
        }

        this.updateInput()
    }

    toBinary(str) {
        return str.toString(2)
    }

    toDecimalBinary(str) {
        return parseInt(str, 2)
    }

    calcBinary(str1, str2) {
        return toBinary(toDecimalBinary(str1) + toDecimalBinary(str2))
    }

    toHexadecimal(str) {
        return str.toString(16).toUpperCase()
    }

    toDecimalHexadecimal(str) {
        return parseInt(str, 16);
    }
}

let calc = new Calc()

document.querySelectorAll("div#calc div.buttons input").forEach(function (button) {
    button.addEventListener("click", function () {
        calc.press(button.value)
    })
})

document.querySelectorAll("div#calc div#conv div").forEach(function (button) {
    button.addEventListener("click", function () {
        let mode = button.id.replace("mode-", "")

        document.querySelectorAll("div.buttons").forEach(function (button) {
            button.classList.add("hidden")
        })

        document.querySelectorAll("div#conv div").forEach(function (button) {
            button.classList.remove("active")
        })

        document.querySelector("div#" + mode + "").classList.remove("hidden")
        document.querySelector("div#conv div#mode-" + mode).classList.add("active")

        calc.mode = mode

        if (mode == "length") {
            calc.unitFrom = "MM"
            calc.unitTo = "CM"
        }
        else if (mode == "weight") {
            calc.unitFrom = "MG"
            calc.unitTo = "G"
        }
        else if (mode == "area") {
            calc.unitFrom = "CM2"
            calc.unitTo = "M2"
        }
    })
})

document.querySelectorAll("div#calc div input.unit-from").forEach(function (button) {
    button.addEventListener("click", function () {
        document.querySelectorAll("div#calc div input.unit-from").forEach(function (button) {
            button.classList.remove("active")
        })

        button.classList.add("active")

        calc.unitFrom = button.value
    })
})

document.querySelectorAll("div#calc div input.unit-to").forEach(function (button) {
    button.addEventListener("click", function () {
        document.querySelectorAll("div#calc div input.unit-to").forEach(function (button) {
            button.classList.remove("active")
        })

        button.classList.add("active")

        calc.unitTo = button.value
    })
})

document.addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
        calc.press("=")
    }
})
