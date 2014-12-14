//Labouchere script by ranged_ (github.com/coonsb/)
//Put in the /users/$user$/documents/iMacros/Macros/ folder and fill out the settings below.
//Press play when you are on the 999Dice site with the single bets tab pulled up.
//I recommend to divide your balance by 100000 and use that as the base bet.

//BEGIN SETUP
var totalSessions = 999999; //Total session to run.
var waitTime = ".4" //Time between bets.
var bets = [.01, .01, .01, .01, .01]; //Set these to what you want to bet.
var defaultBets = [.01, .01, .01, .01, .01]; //Set these to what you want to bet. 
var withdrawAddress = "YOUR_BTC_OR_DOGE_ADDRESS"; //Address to withdraw to.
var amountToWithdraw = "1000"; //Amount to withdraw to your address. !LEAVE THE QUOTES!
var withdrawWhenBalanceReaches = 1001000; //When your balance reaches this number, withdraw. !NO QUOTES!
//END SETUP

//LEAVE THESE ALONE
var bet;
var hiLo = 0;
//END


/**
 * Get the balance of the user.
 */
function getBalance()
{
	var elementGet = window.document.getElementsByClassName("Numbers HighlightedText UserBalance");
	var balance = [];
	
	for(var i = 0; i < elementGet.length; i++)
	{
		balance.push(elementGet[i].innerHTML);
	}
	
	return balance;
}

/**
 * Set the correct bet amounts for a new session.
 */
function setBets()
{
	for(var i = 0; i < defaultBets.length; i++)
	{
		bets[i] = defaultBets[i];
	}
}

/**
 * Perform a bet.
 */
function doBet(betAmount)
{
	window.document.getElementById("BetSizeInput").value = betAmount;
	window.document.getElementById("BetChanceInput").value = "49.95";
	
	if(hiLo == 0)
	{
		var macro = "CODE:TAG POS=1 TYPE=SPAN ATTR=TXT:Bet<SP>Low&&CLASS:BetControlTitle" + "\n";
		macro += "WAIT SECONDS=" + waitTime + "\n";
		iimPlay(macro);
	} 
	else if(hiLo == 1)
	{
		var macro = "CODE:TAG POS=1 TYPE=SPAN ATTR=TXT:Bet<SP>High&&CLASS:BetControlTitle" + "\n";
		macro += "WAIT SECONDS=" + waitTime + "\n";
		iimPlay(macro);
	}
	
	var winOrLoss = window.document.getElementById("LastBetInfoProfit").innerHTML.charAt(0);
	
	if(winOrLoss == "-")
	{
		if(hiLo == 0)
		{
			hiLo++;
		}
		else
		{
			hiLo--;
		}
		
		bets.push(bet);
	}
	else if(winOrLoss != "-")
	{
		bets.shift();
		bets.pop();
	}
}

/**
 * Perform a withdrawal.
 */
function doWithdraw()
{
	window.document.getElementsByClassName("TextButton WithdrawButton")[0].click();
	window.document.getElementById("WithdrawAddress").value = withdrawAddress;
	window.document.getElementById("WithdrawAmount").value = amountToWithdraw;
	window.document.getElementById("WithdrawValueButton").click();
}

/**
 * Main function of the bot
 */
for(var s = 0; s < totalSessions; s++)
{
	if(bets.length == 0)
	{
		setBets();
	}
	
	while(bets.length > 0)
	{
		if(bets.length == 1)
		{
			bet = bets[0];
		} else {
			bet = (bets[0] + bets[bets.length - 1]);
		}
		
		doBet(bet);
	}
	
	if(bets.length == 0)
	{
		if(getBalance() >= withdrawWhenBalanceReaches)
		{
			doWithdraw();
			window.console.log("Withdrawing: " + amountToWithdraw);
			window.console.log("New Balance: " + getBalance());
		}
		
		window.console.log("Session: " + s + " || New Balance: " + getBalance());
		
	}
}