<?php

namespace Airlines\AppBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Airlines\AppBundle\Entity\Board;

/**
 * JSON API Member management controller
 *
 * @Route("/api/member")
 */
class JsonMemberController extends AbstractJsonController
{
    /**
     * Fetches all Members for the given Board
     *
     * @param Board $board
     *
     * @return Response
     *
     * @Route("/{id}", name="member.list", requirements={"id": "\d+"})
     * @Method("GET")
     */
    public function listAction(Board $board)
    {
        $members = $this
            ->getDoctrine()
            ->getManager()
            ->getRepository('AirlinesAppBundle:Member')
            ->findByBoard($board);

        return $this->createJsonResponse($members);
    }
}
