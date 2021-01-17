// https://docs.angularjs.org/guide/bootstrap - manual bootstrap
var app = angular.module("app", []);

app.controller("ctrl", function($scope, $q) {



    $scope.check = async function() {

        $scope.address = address;

        console.log("check", $scope.address);

        let balance = await checkBalance($scope.address);
        let balanceIsland = await checkBalanceIsland($scope.address);
        let balanceStaked = await checkBalanceStaked($scope.address);
        let allowanceIsland = await checkAllowanceIsland($scope.address);
        let allowanceStaked = await checkAllowanceStaked($scope.address);
        
        console.log(balance, balanceIsland.toString(), balanceStaked.toString(), allowanceIsland.toString(), allowanceStaked.toString());

        $scope.balance = ethers.utils.formatEther(balance.toString());
        $scope.balanceIsland = ethers.utils.formatEther(balanceIsland.toString());
        $scope.balanceStaked = ethers.utils.formatEther(balanceStaked.toString());
        $scope.allowanceIsland = ethers.utils.formatEther(allowanceIsland.toString());
        $scope.allowanceStaked - ethers.utils.formatEther(allowanceStaked.toString());

        $scope.$apply();
    }


    async function checkBalance(address) {

        let defer = $q.defer()
        web3.eth.getBalance(address, function(error, result) {
            defer.resolve(result);
        });
        return defer.promise
    }

    async function checkAllowanceIsland(address) {
        let allowance = await island.allowance($scope.address, AssuranceAddress);
        return allowance;
    }

    async function checkBalanceIsland(address) {
        let balance = await island.balanceOf($scope.address);
        return balance;
    }

    async function checkAllowanceStaked(address) {
        let allowance = await staked.allowance($scope.address, AssuranceAddress);
        return allowance;
    }

    async function checkBalanceStaked(address) {
        let balance = await staked.balanceOf($scope.address);
        return balance;
    }

});

async function init() {
    await window.ethereum.enable();

    address = web3.eth.accounts[0];

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // let network = await provider.getNetwork();    
    signer = provider.getSigner();

    assurance = new ethers.Contract(AssuranceAddress, AssuranceABI, signer);
    island    = new ethers.Contract(IslandAddress,    IslandABI,    signer);
    staked    = new ethers.Contract(StakedAddress,    StakedABI,    signer);

  }

  init();
