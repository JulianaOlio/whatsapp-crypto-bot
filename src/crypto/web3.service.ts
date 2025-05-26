import { Injectable } from '@nestjs/common/decorators/core';
import Web3 from 'web3';

@Injectable()
export class Web3Service {
  private web3 = new Web3(process.env.RPC_URL);

  async buyCrypto(userAddress: string, amount: number) {
    //integrar com contrato inteligente
    const tx = await this.web3.eth.sendTransaction({
      from: process.env.WALLET_ADDRESS,
      to: userAddress,
      value: this.web3.utils.toWei(amount.toString(), 'ether'),
    });
    return tx.transactionHash;
  }
}