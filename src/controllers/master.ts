import PraiseController from './praise';

class MasterController {
    private praiseController: PraiseController;

    constructor() {
        this.praiseController = new PraiseController();
    }

    get PraiseController() {
        return this.praiseController;
    }
}

export default new MasterController();
