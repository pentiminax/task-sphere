<?php

namespace App\Service;

use App\Entity\Project;
use App\Entity\User;
use App\Form\Model\SignupModel;
use App\Repository\UserRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserService
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly UserRepository $userRepo
    )
    {
    }

    public function add(SignupModel $signupModel): User
    {
        $user = new User($signupModel->email);

        $user->setPassword($this->passwordHasher->hashPassword($user, $signupModel->password));

        $this->userRepo->add($user, true);

        return $user;
    }

    public function findByQuery(string $query): array
    {
        return $this->userRepo->findByQuery($query);
    }

    public function findByProject(Project $project)
    {
        return $this->userRepo->findByProject($project);
    }
}