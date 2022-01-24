// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

contract Indo is Ownable, ERC20Burnable, ERC20Pausable {
    // Initial supply 4 000 000 000
    uint256 private constant MAX_SUPPLY = 4000000000e18;
    bool private initialClaimed = false;

    constructor() ERC20("Indo Coffee Snoop Dogg", "INDO") {
        _mint(address(this), MAX_SUPPLY);
    }

    function claimTokens() public onlyOwner {
        require(initialClaimed == false, "INDO: Has claimed");
        initialClaimed = true;
        _transfer(address(this), _msgSender(), MAX_SUPPLY);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);
    }
}
